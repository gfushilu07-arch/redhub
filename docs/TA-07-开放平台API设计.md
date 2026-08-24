# TA-07 开放平台 API 设计

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 上游依赖 | TA-03, TA-06 |
| 适用范围 | 外部系统对接（网格事件、组织同步、活动日历） |

---

## 1. 认证体系

### 1.1 应用注册

平台管理员（OPS 或 ADM）为外部系统创建应用：

```sql
CREATE TABLE open_api_app (
    id              UUID PRIMARY KEY,
    tenant_id       UUID NOT NULL REFERENCES tenant(id),
    app_id          VARCHAR(64) NOT NULL UNIQUE,
    app_secret_hash TEXT NOT NULL,                    -- Argon2id 哈希
    name            VARCHAR(200) NOT NULL,
    description     TEXT,
    scopes          JSONB NOT NULL DEFAULT '[]',      -- ["grid:write","grid:read","stats:read"]
    ip_whitelist    JSONB DEFAULT '[]',               -- 可选 IP 白名单
    rate_limit_per_minute INT NOT NULL DEFAULT 60,
    status          VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 1.2 Token 获取

```text
POST /open/v1/auth/token
Content-Type: application/json

{
  "app_id": "grid_city_system_001",
  "app_secret": "sk-xxxxxxxxxxxx",
  "timestamp": 1700000000,
  "nonce": "a1b2c3d4e5",
  "signature": "{hmac_sha256_hex}"
}
```

签名算法：

```rust
pub fn generate_signature(app_id: &str, secret: &str, timestamp: i64, nonce: &str) -> String {
    let payload = format!("{app_id}{secret}{timestamp}{nonce}");
    let mut mac = Hmac::<Sha256>::new_from_slice(secret.as_bytes()).unwrap();
    mac.update(payload.as_bytes());
    hex::encode(mac.finalize().into_bytes())
}
```

响应：

```json
{
  "code": 0,
  "data": {
    "access_token": "eyJhbGciOi...",
    "token_type": "Bearer",
    "expires_in": 7200,
    "scope": "grid:write grid:read"
  }
}
```

### 1.3 安全约束

| 约束项 | 说明 |
|--------|------|
| 时间窗口 | ±5 分钟，防止重放 |
| Nonce 唯一 | Redis SETNX + 5 分钟过期 |
| IP 白名单 | 可选配置；启用后仅白名单 IP 可调用 |
| Scope 校验 | 每个 API 端点标注所需 scope |
| 租户绑定 | AppId 唯一绑定一个 tenant_id |

---

## 2. 网格事件 API

### 2.1 创建事件

```text
POST /open/v1/grid/events
Authorization: Bearer {access_token}
Content-Type: application/json

{
  "category": "sanitation",
  "title": "XX路垃圾桶溢出",
  "description": "路口东侧垃圾桶已满溢，需要清运",
  "images": ["base64_encoded_image_data"],
  "location": {
    "lat": 31.2304,
    "lng": 121.4737,
    "address": "上海市黄浦区XX路100号"
  },
  "priority": "normal",
  "source_ref": "city_grid_sys_event_12345"
}
```

响应：

```json
{
  "code": 0,
  "data": {
    "id": "uuid-of-event",
    "status": "submitted",
    "created_at": "2026-08-24T10:00:00Z"
  }
}
```

### 2.2 更新状态 / 回写结果

```text
PATCH /open/v1/grid/events/{id}
Authorization: Bearer {access_token}

{
  "status": "resolved",
  "result_content": "已安排清运车辆完成清理",
  "operator_name": "王师傅",
  "completed_at": "2026-08-24T14:30:00Z"
}
```

### 2.3 查询

```text
GET /open/v1/grid/events?status=processing&page=1&page_size=20
Authorization: Bearer {access_token}
```

### 2.4 Webhook 回调注册

```text
POST /open/v1/grid/webhooks
Authorization: Bearer {access_token}

{
  "url": "https://external-system.example.com/callback/grid-events",
  "events": ["status_changed", "comment_added"],
  "secret": "webhook_signing_secret"
}
```

Webhook 推送格式：

```json
{
  "event_type": "status_changed",
  "timestamp": 1700000000,
  "data": {
    "event_id": "uuid",
    "old_status": "processing",
    "new_status": "resolved",
    "result_content": "..."
  },
  "signature": "{hmac_sha256(webhook_secret, body)}"
}
```

---

## 3. 其他预留开放能力

### 3.1 组织主数据只读同步（P2）

```text
GET /open/v1/orgs/tree
GET /open/v1/orgs/{id}/members?page=1
```

Scope: `org:read`

### 3.2 活动只读日历（P2）

```text
GET /open/v1/activities?start_date=2026-08&end_date=2026-09
```

Scope: `activity:read`

### 3.3 学习完成结果回传（P2）

```text
POST /open/v1/learning/completions
{
  "user_external_id": "hr_emp_12345",
  "course_external_id": "course_001",
  "completed_at": "...",
  "score": 85
}
```

Scope: `learning:write`

---

## 4. 错误码

复用 TA-03 定义的统一错误码体系。开放 API 特有错误码：

| 错误码 | 说明 |
|--------|------|
| 40103 | AppId 不存在或已被禁用 |
| 40104 | 签名验证失败 |
| 40105 | Timestamp 超出允许窗口 |
| 40106 | Nonce 已被使用（重放检测） |
| 40303 | Scope 权限不足 |
| 40304 | IP 不在白名单内 |

---

## 5. Rate Limiting

从 `open_api_app.rate_limit_per_minute` 读取限流值。

超限时返回：

```json
{
  "code": 42900,
  "message": "Rate limit exceeded",
  "data": null
}
```

Response Headers:

```text
X-RateLimit-Limit: 60
X-RateLimit-Remaining: 45
X-RateLimit-Reset: 1700000060
Retry-After: 12
```
