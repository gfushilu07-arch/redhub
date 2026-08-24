# TA-05 AI Gateway 详细设计

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 所属 Crate | `crates/ai-gateway` |
| 上游依赖 | TA-01 |
| 外部依赖 | Sunlab Agent Platform, 云端 LLM Provider |

---

## 1. 架构定位

AI Gateway 是所有 AI 调用的统一出口。业务服务禁止直连任何模型厂商 SDK，一律经过此网关。

```text
┌────────────────────────────────────────────────────────────┐
│                    业务域（party / learning / grid）          │
│              统一调用 AIGatewayService trait                 │
├────────────────────────────────────────────────────────────┤
│                  AI Gateway（ai-gateway crate）              │
│                                                            │
│  ┌──────────┐  ┌───────────┐  ┌───────────┐               │
│  │ Router    │  │ RateLimiter│  │ AuditLogger │             │
│  │ (路由策略) │  │ (配额限流) │  │ (审计日志)   │             │
+│  └──────────┘  └───────────┘  └───────────┘               │
│  ┌──────────┐  ┌───────────┐                               │
│  │ Adapter   │  │ Fallback   │                              │
│  │ Registry  │  │ Handler    │                              │
│  └──────────┘  └───────────┘                               │
├────────────────────────────────────────────────────────────┤
│                      Adapter 层                             │
│  ┌─────────────────┐  ┌─────────────────┐                 │
│  │ SunlabAdapter    │  │ CloudLLMAdapter  │                │
│  │ (Agent 调用)     │  │ (OpenAI兼容接口)  │                │
│  └─────────────────┘  └─────────────────┘                 │
│  ┌─────────────────┐                                      │
│  │ LocalModelAdapter│  (P2: 本地模型预留)                   │
│  └─────────────────┘                                      │
└────────────────────────────────────────────────────────────┘
```

## 2. 核心类型定义

### 2.1 AI 请求

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiRequest {
    pub tenant_id: Uuid,
    pub org_id: Option<Uuid>,
    pub user_id: Uuid,
    /// 能力编码，如 "llm.chat", "doc.qa", "ocr.parse"
    pub capability: AiCapability,
    /// 数据敏感级别，影响路由策略
    pub data_level: DataLevel,
    /// 路由策略覆盖（可选）
    pub route_policy: Option<RoutePolicy>,
    /// 业务上下文
    pub payload: serde_json::Value,
    /// 用于追踪的请求 ID
    pub request_id: Uuid,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum AiCapability {
    LlmChat,
    DocSummarize,
    DocExtract,
    DocQA,
    DocTaskBreakdown,
    OcrParse,
    KbSearch,
    AsrTranscribe,
    RecommendItem,
    ModerationText,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum DataLevel {
    Public,
    Internal,
    Sensitive,
    Confidential,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RoutePolicy {
    LocalOnly,
    CloudOk,
    Auto,
}
```

### 2.2 AI 响应

```rust
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AiResponse {
    pub request_id: Uuid,
    pub capability: AiCapability,
    pub result: serde_json::Value,
    /// 实际使用的路由和模型
    pub routed_to: RouteTarget,
    /// 消耗 Token 数（如果适用）
    pub tokens_used: Option<TokenUsage>,
    /// 处理耗时
    pub duration_ms: u64,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum RouteTarget {
    Sunlab { agent_type: String },
    Cloud { provider: String, model: String },
    Local { model_name: String },
    KeywordFallback,
}
```

## 3. 路由策略

### 3.1 路由决策流程

```text
请求进入
  │
  ▼
解析 route_policy
  ├── 用户显式指定 → 使用用户指定的策略
  └── 未指定 → 从租户配置读取默认策略
       │
       ▼
根据 data_level 约束
  ├── Confidential → 强制 local_only（无论配置如何）
  ├── Sensitive → 默认 local_only；租户可配置 cloud_ok
  └── Internal/Public → 按 tenant 配置
       │
       ▼
检查配额
  ├── 配额不足 → 拒绝或降级到关键词搜索
  └── 配额充足 → 继续
       │
       ▼
选择 Adapter
  ├── local_only → LocalModelAdapter / KeywordFallback
  ├── cloud_ok → SunlabAdapter 或 CloudLLMAdapter
  └── auto → 根据能力映射表自动选择最佳路由
```

### 3.2 能力与路由映射表

| 能力 | 默认路由 | 本地支持 | 云端支持 |
|------|----------|----------|----------|
| llm.chat | auto | P2 | ✓ |
| doc.summarize | auto | P2 | ✓ |
| doc.qa | auto | P2 | ✓ |
| ocr.parse | auto | P2 | ✓ |
| kb.search | keyword first | ✓(关键词) | ✓(向量) |
| asr.transcribe | cloud_ok | ✗ | ✓ |
| recommend.item | auto | P2 | ✓ |
| moderation.text | cloud_ok | ✗ | ✓ |

## 4. Adapter 实现

### 4.1 Trait 定义

```rust
#[async_trait]
pub trait AiAdapter: Send + Sync {
    fn supports(&self, capability: &AiCapability) -> bool;
    async fn execute(&self, request: &AiRequest) -> Result<AiResponse>;
    fn health_check(&self) -> HealthStatus;
}
```

### 4.2 Sunlab Adapter

```rust
pub struct SunlabAdapter {
    base_url: String,
    api_key: String,
    http_client: reqwest::Client,
}

impl SunlabAdapter {
    async fn call_agent(&self, request: &AiRequest) -> Result<serde_json::Value> {
        let url = format!("{}/ai/agent/execute", self.base_url);
        let body = json!({
            "tenant_id": request.tenant_id,
            "agent_type": map_capability_to_agent(&request.capability),
            "payload": request.payload,
            "callback_url": self.callback_url(request.request_id),
            "priority": "normal",
            "timeout_seconds": 300
        });

        let resp = self.http_client.post(&url)
            .header("Authorization", format!("Bearer {}", self.api_key))
            .json(&body)
            .send()
            .await?;

        // 同步等待或异步回调取决于 Agent 类型
        let result: serde_json::Value = resp.json().await?;
        Ok(result["result"].clone())
    }
}
```

### 4.3 Cloud LLM Adapter

```rust
pub struct CloudLLMAdapter {
    providers: Vec<Box<dyn LlmProvider>>,
    default_provider_index: usize,
}

#[async_trait]
impl LlmProvider for OpenAICompatibleProvider {
    async fn chat_completion(
        &self,
        messages: Vec<ChatMessage>,
        options: CompletionOptions,
    ) -> Result<CompletionResponse> {
        let url = format!("{}/v1/chat/completions", self.base_url);
        // 标准 OpenAI 兼容 API 调用
    }
}
```

**支持的云端 Provider：**
- OpenAI 兼容接口（通义千问、智谱、百川等均兼容）
- Azure OpenAI
- Google Gemini（通过兼容层）

## 5. 配额管理

### 5.1 租户级配额

从 `tenant.quota_json` 读取：

```json
{
  "ai_calls_monthly": 10000,
  "ai_tokens_monthly": 5000000,
  "agent_executions_monthly": 5000
}
```

### 5.2 Redis 计数器

```rust
pub struct QuotaManager {
    redis: deadpool_redis::Pool,
}

impl QuotaManager {
    const QUOTA_KEY_PREFIX: &'static str = "quota:ai";

    pub async fn check_and_increment(
        &self,
        tenant_id: Uuid,
        capability: &AiCapability,
    ) -> Result<bool> {
        let key = format!(
            "{}:{}:{}:{}",
            Self::QUOTA_KEY_PREFIX,
            tenant_id,
            chrono::Utc::now().format("%Y%m"),
            capability
        );

        let mut conn = self.redis.get().await?;
        let count: i64 = redis::cmd("INCR")
            .arg(&key)
            .query_async(&mut conn)
            .await?;

        // 首次调用设置过期时间
        if count == 1 {
            let _: () = redis::cmd("EXPIRE")
                .arg(&key)
                .arg(31 * 86400) // 31 天过期
                .query_async(&mut conn)
                .await?;
        }

        let limit = self.get_tenant_limit(tenant_id, capability).await?;
        Ok(count <= limit)
    }
}
```

## 6. 审计日志

每次 AI 调用记录完整审计信息：

```sql
CREATE TABLE ai_audit_log (
    id              BIGSERIAL PRIMARY KEY,
    tenant_id       UUID NOT NULL,
    user_id         UUID NOT NULL,
    capability      VARCHAR(50) NOT NULL,
    route_target    VARCHAR(100) NOT NULL,      -- sunlab/cloud/local/fallback
    model_used      VARCHAR(200),
    tokens_input    INT,
    tokens_output   INT,
    duration_ms     INT NOT NULL,
    success         BOOLEAN NOT NULL,
    error_message   TEXT,
    data_level      VARCHAR(30),
    request_payload JSONB,                       -- 可配置脱敏存储
    response_summary TEXT,                       -- 仅存摘要，不存全文
    request_id      UUID NOT NULL,
    occurred_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_ai_audit_tenant_time ON ai_audit_log(tenant_id, occurred_at DESC);
```

## 7. 降级策略

```rust
pub struct FallbackHandler;

impl FallbackHandler {
    pub async fn handle_failure(
        &self,
        request: &AiRequest,
        error: &AiError,
    ) -> Result<AiResponse> {
        match error {
            AiError::ProviderUnavailable => {
                // 尝试下一个 Provider 或降级
                if request.capability == AiCapability::KbSearch {
                    return self.keyword_search_fallback(request).await;
                }
                Err(error.into())
            }
            AiError::QuotaExceeded => {
                // 通知管理员并拒绝
                self.notify_quota_exceeded(request.tenant_id).await;
                Err(error.into())
            }
            _ => Err(error.into()),
        }
    }

    async fn keyword_search_fallback(&self, request: &AiRequest) -> Result<AiResponse> {
        // 使用 PostgreSQL 全文检索替代向量搜索
        let query = request.payload["query"].as_str().unwrap_or("");
        let results = self.pg_full_text_search(query).await?;
        Ok(AiResponse {
            result: serde_json::to_value(results)?,
            routed_to: RouteTarget::KeywordFallback,
            ..Default::default()
        })
    }
}
```

## 8. API 接口

```rust
pub fn router() -> Router<Arc<AppState>> {
    Router::new()
        .route("/ai/execute", post(execute))
        .route("/ai/status/:request_id", get(get_status))
        .route("/ai/quota", get(get_quota_usage))
        .with_state(state)
}

async fn execute(
    State(state): State<Arc<AppState>>,
    Json(req): Json<AiExecuteRequest>,
) -> Result<Json<ApiResponse<AiResponse>>, ApiError> {
    let response = state.ai_gateway.execute(req.into()).await?;
    Ok(Json(ApiResponse::ok(response)))
}
```
