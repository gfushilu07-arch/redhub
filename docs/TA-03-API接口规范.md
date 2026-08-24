# TA-03 API 接口规范

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 协议 | RESTful HTTP/1.1 + WebSocket + SSE |
| API 文档生成 | utoipa (OpenAPI 3.0) |
| 上游依赖 | TA-01 技术架构总览 |

---

## 1. 全局约定

### 1.1 Base URL

```text
# 内部业务 API
/api/v1/{domain}/{resource}

# 开放平台 API（外部系统调用）
/open/v1/{resource}

# 平台运营后台 API
/ops/v1/{resource}
```

### 1.2 版本策略

- URL 路径版本：`/api/v1/`
- 大版本升级时新增 `/api/v2/`，v1 保留至少 6 个月
- 向后兼容变更（新增可选字段）不升版本

### 1.3 认证

```text
Authorization: Bearer {access_token}
```

JWT Payload 结构：

```json
{
  "sub": "user_uuid",
  "tenant_id": "tenant_uuid",
  "roles": ["org_secretary"],
  "permissions": ["party:member:create", "..."],
  "exp": 1700000000,
  "iat": 1699998200
}
```

### 1.4 租户上下文

所有请求通过 JWT 自动携带 `tenant_id`，中间件提取后注入请求上下文。

开放 API 通过 `X-Tenant-Id` Header 显式传递（需与 AppId 绑定的租户一致）。

### 1.5 Content-Type

- 请求：`application/json`（文件上传用 `multipart/form-data`）
- 响应：`application/json; charset=utf-8`

---

## 2. 统一响应格式

### 2.1 成功响应

```json
{
  "code": 0,
  "message": "ok",
  "data": { ... }
}
```

### 2.2 分页响应

```json
{
  "code": 0,
  "message": "ok",
  "data": {
    "list": [ ... ],
    "total": 1234,
    "page": 1,
    "page_size": 20,
    "total_pages": 62
  }
}
```

分页参数：

| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| page | int | 1 | 页码，从 1 开始 |
| page_size | int | 20 | 每页条数，最大 100 |
| sort_by | string | created_at | 排序字段 |
| sort_order | string | desc | asc / desc |

### 2.3 错误响应

```json
{
  "code": 40101,
  "message": "Token expired",
  "data": null,
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

---

## 3. 错误码体系

### 3.1 格式

错误码为 5 位数字：`{HTTP状态码后3位}{业务序号2位}`

### 3.2 错误码清单

| 错误码 | HTTP 状态 | 说明 |
|--------|-----------|------|
| 40000 | 400 | 通用请求参数错误 |
| 40100 | 401 | 未认证 |
| 40101 | 401 | Token 过期 |
| 40102 | 401 | Token 无效 |
| 40300 | 403 | 无权限 |
| 40301 | 403 | 跨租户访问被拒绝 |
| 40302 | 403 | 配额已用尽 |
| 40400 | 404 | 资源不存在 |
| 40900 | 409 | 资源冲突（重复创建等） |
| 42200 | 422 | 业务校验失败 |
| 42900 | 429 | 请求频率超限 |
| 50000 | 500 | 服务器内部错误 |
| 50100 | 501 | AI 服务不可用 |
| 50200 | 502 | Sunlab Agent 调用失败 |
| 50300 | 503 | 服务暂时不可用 |

---

## 4. 各域 API 端点清单

### 4.1 认证域（auth）

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/auth/login` | 账号密码登录 |
| POST | `/api/v1/auth/login/wechat` | 微信登录 |
| POST | `/api/v1/auth/login/sms` | 短信验证码登录 |
| POST | `/api/v1/auth/token/refresh` | 刷新 Token |
| POST | `/api/v1/auth/logout` | 登出 |

### 4.2 组织域（platform）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/orgs/tree` | 获取组织树 |
| POST | `/api/v1/orgs` | 创建组织 |
| PUT | `/api/v1/orgs/{id}` | 更新组织 |
| DELETE | `/api/v1/orgs/{id}` | 删除组织（软删） |
| GET | `/api/v1/users` | 用户列表 |
| POST | `/api/v1/users` | 创建用户 |
| GET | `/api/v1/roles` | 角色列表 |
| POST | `/api/v1/roles/{id}/permissions` | 分配权限 |

### 4.3 党务域（party）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/party/members` | 党员列表（分页） |
| POST | `/api/v1/party/members` | 创建党员档案 |
| GET | `/api/v1/party/members/{id}` | 党员详情 |
| PUT | `/api/v1/party/members/{id}` | 更新党员信息 |
| DELETE | `/api/v1/party/members/{id}` | 删除（软删） |
| POST | `/api/v1/party/members/import` | Excel 批量导入 |
| GET | `/api/v1/party/members/export` | 导出 Excel |
| GET | `/api/v1/party/dues/bills` | 党费账单列表 |
| POST | `/api/v1/party/dues/bills/generate` | 生成本月账单 |
| PUT | `/api/v1/party/dues/bills/{id}/register` | 登记缴纳 |
| GET | `/api/v1/party/meetings` | 会议列表 |
| POST | `/api/v1/party/meetings` | 创建会议 |
| PUT | `/api/v1/party/meetings/{id}/minutes` | 提交会议纪要 |
| GET | `/api/v1/party/meetings/{id}/attendees` | 参会人列表 |

### 4.4 学习域（learning）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/learning/courses` | 课程列表 |
| POST | `/api/v1/learning/courses/{id}/progress` | 上报学习进度（心跳） |
| GET | `/api/v1/learning/exams` | 考试列表 |
| POST | `/api/v1/learning/exams/{id}/start` | 开始考试 |
| POST | `/api/v1/learning/exams/{id}/submit` | 提交答案 |

### 4.5 服务域（service）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/service/activities` | 活动列表 |
| POST | `/api/v1/service/activities/{id}/register` | 报名活动 |
| GET | `/api/v1/service/venues` | 场地列表 |
| POST | `/api/v1/service/venues/{id}/bookings` | 预约场地 |
| POST | `/api/v1/service/complaints` | 提交诉求 |
| POST | `/api/v1/service/wishes` | 发布微心愿 |
| POST | `/api/v1/service/wishes/{id}/claim` | 认领微心愿 |

### 4.6 网格域（grid）

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/grid/events` | 事件列表 |
| POST | `/api/v1/grid/events` | 上报事件 |
| PATCH | `/api/v1/grid/events/{id}/status` | 更新事件状态 |
| GET | `/api/v1/grid/stats` | 网格统计看板 |

### 4.7 共享能力

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/checkin` | 签到 |
| GET | `/api/v1/workflows/tasks` | 我的待办任务 |
| POST | `/api/v1/workflows/instances/{id}/signals` | 审批操作 |
| POST | `/api/v1/files/upload` | 文件上传 |
| GET | `/api/v1/notifications` | 消息通知列表 |
| PUT | `/api/v1/notifications/read-all` | 标记全部已读 |
| GET | `/api/v1/sse/subscribe` | SSE 订阅实时推送 |

---

## 5. 开放平台 API

### 5.1 认证方式

AppId + AppSecret 获取 access_token：

```text
POST /open/v1/auth/token
Content-Type: application/json

{
  "app_id": "xxx",
  "app_secret": "yyy",
  "timestamp": 1700000000,
  "nonce": "abc123",
  "signature": "sha256(app_id+app_secret+timestamp+nonce)"
}
```

返回的 access_token 有效期 2 小时。

### 5.2 网格事件 API

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/open/v1/grid/events` | 创建事件 |
| PATCH | `/open/v1/grid/events/{id}` | 更新状态/回写结果 |
| GET | `/open/v1/grid/events/{id}` | 查询详情 |
| GET | `/open/v1/grid/events` | 分页查询 |
| POST | `/open/v1/grid/webhooks` | 注册回调地址 |

---

## 6. SSE 推送协议

客户端订阅：

```text
GET /api/v1/sse/subscribe?channels=notification,workflow,approval
Authorization: Bearer {access_token}
Accept: text/event-stream
```

服务端推送格式：

```text
event: notification
data: {"title":"您有一条新的待办","biz_type":"workflow","biz_id":"..."}

event: approval_status
data: {"instance_id":"...","status":"approved","approver_name":"张三"}
```

心跳保活：每 30 秒发送 `event: ping\ndata: {}\n\n`

---

## 7. WebSocket 协议（协同编辑）

连接地址：`wss://api.example.com/ws/collab?doc_id={uuid}&token={jwt}`

消息格式：

```json
{
  "type": "cursor",
  "payload": {
    "user_id": "...",
    "position": { "line": 5, "column": 12 },
    "selection": { "start": 10, "end": 25 }
  }
}

{
  "type": "operation",
  "payload": {
    "ops": [
      { "type": "insert", "position": 42, "text": "同意" },
      { "type": "delete", "position": 10, "length": 3 }
    ],
    "version": 15,
    "lamport_timestamp": 1700000000123
  }
}
```

---

## 8. 文件上传

```text
POST /api/v1/files/upload
Content-Type: multipart/form-data

file: (binary)
module: party_member    -- 用于路径分类
```

响应：

```json
{
  "code": 0,
  "data": {
    "file_id": "uuid",
    "url": "/files/{tenant_id}/{module}/{date}/{uuid}.pdf",
    "file_name": "入党申请书.pdf",
    "size": 102400,
    "mime_type": "application/pdf"
  }
}
```

限制：
- 单文件最大 50MB
- 支持格式：PDF, Word, Excel, 图片(JPG/PNG/GIF/WebP), 音频(MP3/WAV), 视频(MP4)
- 视频上传支持分片续传（预留）
