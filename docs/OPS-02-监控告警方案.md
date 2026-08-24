# OPS-02 监控告警方案

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 上游依赖 | TA-01 |
| 技术栈 | Prometheus + Grafana + Loki + OpenTelemetry |

---

## 1. 可观测性三支柱

```text
┌─────────────────────────────────────────────────────────┐
│                     应用层 (Rust / Axum)                  │
│                                                         │
│   tracing → stdout(JSON)     /metrics endpoint          │
│        │                         │                      │
│        ▼                         ▼                      │
├────── Loki ──────────────── Prometheus ──── OTLP ───────┤
│   (日志聚合)               (指标采集)      (链路追踪)      │
│        │                         │            │         │
│        ▼                         ▼            ▼         │
├── Grafana (统一面板：日志 + 指标 + Trace 关联查询) ───────┤
└─────────────────────────────────────────────────────────┘
```

---

## 2. 日志（Logging）

### 2.1 结构化日志格式

使用 `tracing` + `tracing-subscriber` 输出 JSON：

```json
{
  "timestamp": "2026-08-24T10:00:00.123Z",
  "level": "INFO",
  "target": "party::service",
  "message": "Member created",
  "tenant_id": "uuid",
  "user_id": "uuid",
  "request_id": "uuid",
  "method": "POST",
  "path": "/api/v1/party/members",
  "status_code": 201,
  "duration_ms": 45
}
```

### 2.2 日志级别规范

| 级别 | 使用场景 | 生产环境是否输出 |
|------|----------|----------------|
| ERROR | 未预期的异常、外部服务不可用、数据一致性错误 | ✓ |
| WARN | 业务异常（如配额不足）、慢查询、重试操作 | ✓ |
| INFO | 正常业务事件（登录、创建、审批） | ✓ |
| DEBUG | 详细调试信息 | ✗（仅开发环境） |
| TRACE | 极详细追踪 | ✗ |

### 2.3 Loki 配置

```yaml
# loki-config.yml
auth_enabled: false

server:
  http_listen_port: 3100

schema_config:
  configs:
    - from: 2024-01-01
      store: tsdb
      object_store: filesystem
      schema: v13
      index:
        prefix: index_
        period: 24h

limits_config:
  retention_period: 720h   # 30 天保留
```

Promtail 或 Alloy 采集容器 stdout：

```yaml
# promtail-config.yml（关键配置）
scrape_configs:
  - job_name: redhub
    docker_sd_configs:
      - host: unix:///var/run/docker.sock
    pipeline_stages:
      - json:
          expressions:
            level: level
            tenant_id: tenant_id
            request_id: request_id
```

---

## 3. 指标（Metrics）

### 3.1 内置指标

Axum 自动暴露的 HTTP 指标：

```text
axum_http_requests_total{method,path,status_code}
axum_http_requests_duration_seconds_bucket{method,path}
```

### 3.2 自定义业务指标

```rust
use prometheus::{Counter, Histogram, Gauge, register};

// 业务计数器
lazy_static! {
    static ref PARTY_MEMBER_CREATED: Counter = register_counter!(
        "redhub_party_member_created_total",
        "Total number of party members created"
    ).unwrap();

    static ref MEETING_CHECKIN_TOTAL: Counter = register_counter!(
        "redhub_meeting_checkin_total",
        "Total meeting check-ins by method",
        ["method"] // label: qrcode/gps/face
    ).unwrap();

    static ref AI_CALL_DURATION: Histogram = register_histogram!(
        "redhub_ai_call_duration_seconds",
        "AI Gateway call duration",
        vec![0.1, 0.5, 1.0, 5.0, 10.0, 30.0],
        ["capability", "route"]
    ).unwrap();

    static ref WORKFLOW_ACTIVE_INSTANCES: Gauge = register_gauge!(
        "redhub_workflow_active_instances",
        "Currently active workflow instances"
    ).unwrap();

    static ref AGENT_TASK_QUEUE_DEPTH: Gauge = register_gauge!(
        "redhub_agent_task_queue_depth",
        "Pending agent tasks in Sunlab queue"
    ).unwrap();
}
```

### 3.3 指标清单

| 指标名 | 类型 | 标签 | 用途 |
|--------|------|------|------|
| `redhub_http_requests_duration_seconds` | Histogram | method, path | API 延迟分布 |
| `redhub_db_query_duration_seconds` | Histogram | operation | 数据库查询延迟 |
| `redhub_redis_operation_duration_seconds` | Histogram | command | Redis 操作延迟 |
| `redhub_ai_call_total` | Counter | capability, route, status | AI 调用次数 |
| `redhub_workflow_state_transitions` | Counter | from_state, to_state | 工作流状态流转 |
| `redhub_active_sse_connections` | Gauge | — | 当前 SSE 连接数 |
| `redhub_tenant_quota_usage` | Gauge | tenant_id, quota_type | 租户配额使用率 |
| `redhub_open_api_calls` | Counter | app_id, endpoint | 开放 API 调用次数 |

---

## 4. 链路追踪（Tracing）

### 4.1 OpenTelemetry 集成

```rust
use opentelemetry_otlp::new_exporter;

pub fn init_tracing() {
    let tracer = opentelemetry_otlp::new_pipeline()
        .tracing()
        .with_exporter(
            new_exporter().tonic().with_endpoint("http://otel-collector:4317")
        )
        .install_batch(opentelemetry_sdk::runtime::Tokio)
        .unwrap();

    let telemetry = tracing_opentelemetry::layer().with_tracer(tracer);

    tracing_subscriber::registry()
        .with(telemetry)
        .with(tracing_subscriber::fmt::layer().json())
        .with(tracing_subscriber::EnvFilter::from_default_env())
        .init();
}
```

### 4.2 Request ID 全链路透传

```rust
pub async fn request_id_middleware(
    mut req: Request<Body>,
    next: Next,
) -> Response {
    let request_id = req.headers()
        .get("X-Request-Id")
        .and_then(|v| v.to_str().ok())
        .map(|s| Uuid::parse_str(s).unwrap_or_else(|_| Uuid::now_v7()))
        .unwrap_or_else(Uuid::now_v7);

    req.extensions_mut().insert(request_id);
    let span = tracing::info_span!("request", request_id = %request_id);
    let _guard = span.enter();

    let mut response = next.run(req).await;
    response.headers_mut().insert("X-Request-Id", request_id.to_string().parse().unwrap());
    response
}
```

---

## 5. 告警规则

### 5.1 基础设施告警

| 告警名称 | 条件 | 严重级别 | 通知方式 |
|----------|------|----------|---------|
| HighErrorRate | `rate(http_5xx[5m]) > 1%` | P1 | 电话 + 短信 |
| HighP99Latency | `histogram_quantile(0.99, http_duration) > 2s` | P2 | 企业微信 |
| DBConnectionPoolExhausted | `db_pool_available == 0 for 1m` | P1 | 电话 |
| RedisDown | `redis_up == 0 for 1m` | P1 | 电话 |
| DiskSpaceLow | `disk_free_percent < 15%` | P2 | 企业微信 |
| CertificateExpiringSoon | `tls_expiry_days < 14` | P3 | 邮件 |

### 5.2 业务告警

| 告警名称 | 条件 | 严重级别 |
|----------|------|---------|
| AIGatewayUnavailable | `ai_call_success_rate[5m] < 80%` | P2 |
| AgentQueueBacklog | `agent_queue_depth > 100 for 5m` | P3 |
| WorkflowStuckInstances | `workflow_active_instances > expected * 2 for 30m` | P3 |
| TenantQuotaNearLimit | `quota_usage_percent > 90` | P3 |
| SSEConnectionSpike | `active_sse_connections > baseline * 3` | P3 |

### 5.3 AlertManager 路由

```yaml
# alertmanager.yml
route:
  receiver: default
  group_by: ['alertname', 'tenant_id']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h

  routes:
    - match:
        severity: P1
      receiver: oncall
      repeat_interval: 15m

    - match:
        severity: P2
      receiver: team_wechat

receivers:
  - name: oncall
    webhook_configs:
      - url: "https://alert-bridge.example.com/call"
    # PagerDuty / 阿里云电话告警等

  - name: team_wechat
    wechat_configs:
      - corp_id: "xxx"
        agent_id: "yyy"
        to_user: "@all"

  - name: default
    email_configs:
      - to: "ops@example.com"
```

---

## 6. Grafana Dashboard 设计

### 6.1 推荐面板列表

| 面板名称 | 图表类型 | 数据源 | 关键指标 |
|----------|----------|--------|---------|
| 服务概览 | Stat | Prometheus | QPS, 错误率, P50/P99 延迟, 活跃连接数 |
| API 延迟分布 | Heatmap | Prometheus | 按 path 和时间的热力图 |
| 数据库性能 | Time series | PostgreSQL Exporter | 活跃连接数, 慢查询数, 缓存命中率 |
| Redis 监控 | Time series | Redis Exporter | 内存使用, QPS, 命中率, Key 数量 |
| AI Gateway | Bar gauge | Prometheus | 按能力分调用次数和成功率 |
| 工作流健康度 | Table + Stat | Prometheus | 活跃实例数, 各状态数量, 平均完成时间 |
| 业务日志 | Logs | Loki | 按级别和关键词过滤的实时日志流 |

### 6.2 Dashboard JSON 导出

所有 Dashboard 定义文件纳入版本控制：

```text
grafana/dashboards/
├── overview.json           # 服务概览
├── api-performance.json    # API 性能
├── database.json           # 数据库监控
├── ai-gateway.json         # AI Gateway
├── workflow-health.json    # 工作流健康度
└── business-metrics.json   # 业务指标（签到率、活动参与等）
```

通过 Grafana Provisioning 自动加载：

```yaml
# grafana/provisioning/dashboards/dashboards.yml
providers:
  - name: 'default'
    folder: 'RedHub'
    type: file
    options:
      path: /var/lib/grafana/dashboards
```

---

## 7. SLO 定义

| 服务等级目标 (SLO) | 目标值 | 测量窗口 | 错误预算 |
|-------------------|--------|----------|---------|
| API 可用性 | 99.9% | 月度 | 43.8 分钟/月 |
| API P99 延迟 < 500ms | 99% | 月度 | 7.2 小时/月 |
| 数据持久性 | 99.999999% | 年度 | — |
| 备份成功率 | 100% | 每日 | — |

当错误预算耗尽时，冻结新功能发布，优先修复稳定性问题。

---

## 8. 运维值班与响应流程

| 严重级别 | 响应时限 | 处理时限 | 通知对象 |
|----------|----------|----------|---------|
| P1（服务不可用） | 5 分钟 | 1 小时 | 值班工程师 + 技术负责人 |
| P2（功能降级） | 15 分钟 | 4 小时 | 值班工程师 |
| P3（非紧急异常） | 1 小时 | 下个工作日 | 团队群通知 |
