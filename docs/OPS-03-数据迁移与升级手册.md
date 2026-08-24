# OPS-03 数据迁移与升级手册

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 上游依赖 | TA-02, OPS-01 |
| 适用范围 | Mode-S 与 Mode-D |

---

## 1. 迁移管理策略

### 1.1 SeaORM Migration 规范

```bash
# 创建新迁移
sea-orm-cli migrate generate m001_create_tenant_tables

# 目录结构
migration/
├── src/
│   ├── lib.rs
│   ├── m20260824_000001_create_platform_tables.rs
│   ├── m20260824_000002_create_party_tables.rs
│   ├── m20260824_000003_create_learning_tables.rs
│   └── ...
├── Cargo.toml
└── main.rs
```

### 1.2 命名规范

```text
m{YYYYMMDD}_{sequence}_{description}.rs

示例：
m20260824_000001_create_platform_tables.rs
m20260825_000002_add_party_member_tags_column.rs
```

### 1.3 编写规则

```rust
use sea_orm_migration::prelude::*;

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 正向迁移：创建表/加字段
        manager.create_table(
            Table::create()
                .table(PartyMember::Table)
                .col(ColumnDef::new(PartyMember::Id).uuid().primary_key())
                .col(ColumnDef::new(PartyMember::TenantId).uuid().not_null())
                // ...
                .to_owned(),
        ).await
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        // 反向迁移：必须可回滚
        manager.drop_table(Table::drop().table(PartyMember::Table).to_owned()).await
    }
}
```

---

## 2. 大表变更安全操作

### 2.1 加索引（避免锁表）

```sql
-- ❌ 错误：会锁表
CREATE INDEX idx_member_org ON party_member(tenant_id, org_id);

-- ✅ 正确：并发建索引不阻塞读写
CREATE INDEX CONCURRENTLY idx_member_org ON party_member(tenant_id, org_id);
```

在 SeaORM migration 中执行原生 SQL：

```rust
manager.get_connection().execute_unprepared(
    "CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_member_org ON party_member(tenant_id, org_id)"
).await?;
```

### 2.2 加非空列（分步执行）

```text
Step 1: ALTER TABLE party_member ADD COLUMN new_field VARCHAR(200) NULL;
Step 2: UPDATE party_member SET new_field = 'default_value' WHERE new_field IS NULL; -- 分批
Step 3: ALTER TABLE party_member ALTER COLUMN new_field SET NOT NULL;
```

### 2.3 重命名列（兼容期方案）

```text
Phase 1 (v1.0): 同时写入 old_column 和 new_column；读走 old_column
Phase 2 (v1.1): 读切换到 new_column；确认无回退需求
Phase 3 (v1.2): 删除 old_column
```

---

## 3. 升级流程

### 3.1 标准升级步骤（Mode-S Kubernetes）

```bash
# Step 1: 备份
kubectl exec -n redhub postgres-0 -- pg_dump -U redhub redhub | gzip > backup_pre_upgrade.sql.gz

# Step 2: 运行数据库迁移（单独 Job）
kubectl apply -f k8s/migration-job.yaml
kubectl wait --for=condition=complete -n redhub job/redhub-migration --timeout=300s

# Step 3: 滚动更新应用
helm upgrade redhub ./helm/redhub \
  --namespace redhub \
  --values helm/redhub/values-prod.yaml \
  --set image.tag=v{new_version} \
  --wait --timeout 600s

# Step 4: 健康检查
curl -f https://api.example.com/healthz
curl -f https://api.example.com/readyz

# Step 5: 验证核心功能
npx playwright test e2e/smoke/
```

### 3.2 独立部署升级步骤（Mode-D）

```bash
# Step 1: 备份当前版本和数据库
cp /opt/redhub/redhub-server /opt/redhub/redhub-server.bak.$(date +%Y%m%d)
pg_dump "$DATABASE_URL" | gzip > /opt/redhub/backups/pre_upgrade.sql.gz

# Step 2: 解压新版本安装包
tar xzf redhub-dedicated-v{version}.tar.gz -C /tmp/redhub-upgrade/

# Step 3: 替换二进制文件
systemctl stop redhub
cp /tmp/redhub-upgrade/redhub-server /opt/redhub/redhub-server
chmod +x /opt/redhub/redhub-server

# Step 4: 运行迁移
/opt/redhub/redhub-server migrate --config /opt/redhub/config/production.toml

# Step 5: 启动服务
systemctl start redhub
sleep 5

# Step 6: 验证
curl -f http://localhost:8080/healthz
curl -f http://localhost:8080/readyz
```

---

## 4. 回滚流程

### 4.1 判断是否需要回滚

| 检查项 | 通过标准 |
|--------|---------|
| 健康检查 | `/healthz` 和 `/readyz` 均 200 |
| 错误率 | < 0.1%（发布后前 15 分钟） |
| 核心接口响应时间 | P99 < 2s |
| E2E 冒烟测试 | 全部通过 |

### 4.2 应用层回滚

```bash
# Kubernetes
helm rollback redhub --namespace redhub [REVISION]

# Docker Compose
TAG=v{previous_version} docker-compose up -d

# Mode-D
systemctl stop redhub
cp /opt/redhub/redhub-server.bak /opt/redhub/redhub-server
systemctl start redhub
```

### 4.3 数据库回滚

```bash
# 仅当 Schema 变更导致不兼容时才需要数据库回滚
# SeaORM 自动降级
cd migration && sea-orm-cli migrate down

# 或手动恢复备份（最后手段）
psql "$DATABASE_URL" < pre_upgrade_backup.sql
```

> ⚠️ 数据库回滚可能导致数据丢失。优先通过应用层回滚解决。

---

## 5. 租户级灰度发布

### 5.1 特性开关 + 金丝雀

```rust
// 通过 Redis 存储灰度配置
pub struct CanaryConfig {
    pub version: String,
    pub tenant_ids: Vec<Uuid>,   // 参与灰度的租户列表
    pub percentage: u32,         // 或按百分比灰度
}

pub async fn should_use_new_version(
    redis: &Pool,
    tenant_id: Uuid,
) -> Result<bool> {
    let config: Option<CanaryConfig> = redis_get_json(redis, "canary:config").await?;
    match config {
        Some(cfg) => Ok(cfg.tenant_ids.contains(&tenant_id)),
        None => Ok(false),
    }
}
```

### 5.2 灰度步骤

```text
Phase 0: 内部测试租户（平台方自有租户）→ 观察 24h
Phase 1: 选择 1-2 个友好客户租户 → 观察 48h
Phase 2: 按 10% → 50% → 100% 逐步放量
每个 Phase 监控错误率和延迟，异常立即回滚该阶段
```

---

## 6. 多版本兼容性保证

### 6.1 API 兼容性规则

| 变更类型 | 是否需要兼容旧版 | 说明 |
|----------|-----------------|------|
| 新增可选请求字段 | ✓ 不破坏 | 旧客户端不传即可 |
| 新增响应字段 | ✓ 不破坏 | 旧客户端忽略未知字段 |
| 删除字段 | ✗ 破坏 | 需要 API 版本升级 |
| 修改字段类型 | ✗ 破坏 | 需要 API 版本升级 |
| 修改字段名 | ✗ 破坏 | 需要 API 版本升级 |

### 6.2 数据库兼容性窗口

升级过程中新旧版本共存时的兼容策略：

```text
N-1 版本（旧版仍在运行）     N 版本（新版已部署部分实例）
         │                           │
         ▼                           ▼
    读取 old_column          读取 new_column（有值则用，否则 fallback 到 old_column）
         │                           │
         └───────────┬───────────────┘
                     ▼
              写入同时更新两列
```

确保在滚动更新期间，任何实例无论运行新旧代码都能正确读写数据。
