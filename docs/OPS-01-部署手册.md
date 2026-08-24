# OPS-01 部署手册

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 上游依赖 | TA-01 技术架构总览 |
| 适用范围 | Mode-S（标准版多租户）+ Mode-D（大客户独立部署） |

---

## 1. Mode-S 标准版多租户部署

### 1.1 环境要求

| 组件 | 最低配置 | 推荐配置 |
|------|----------|----------|
| 应用服务器 | 2C4G × 2 台 | 4C8G × 3 台（K8s） |
| PostgreSQL | 2C4G, 100GB SSD | 4C16G, 500GB SSD + 只读副本 |
| Redis | 1C2G | 2C4G 哨兵模式 |
| 对象存储 | MinIO 单节点 | MinIO 分布式 4 节点 |

### 1.2 Docker Compose（开发/演示环境）

```yaml
# docker-compose.yml
version: "3.8"

services:
  app:
    image: redhub-server:${TAG:-latest}
    ports:
      - "8080:8080"
    environment:
      - RUST_LOG=info
      - DATABASE_URL=postgres://redhub:${DB_PASSWORD}@postgres:5432/redhub
      - REDIS_URL=redis://redis:6379
      - DEPLOY_MODE=shared
      - JWT_SECRET=${JWT_SECRET}
      - S3_ENDPOINT=http://minio:9000
      - S3_ACCESS_KEY=${MINIO_ROOT_USER}
      - S3_SECRET_KEY=${MINIO_ROOT_PASSWORD}
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    restart: unless-stopped

  postgres:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: redhub
      POSTGRES_PASSWORD: ${DB_PASSWORD}
      POSTGRES_DB: redhub
    volumes:
      - pg_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U redhub"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 5s
      timeout: 5s
      retries: 5
    restart: unless-stopped

  minio:
    image: minio/minio
    command: server /data --console-address ":9001"
    environment:
      MINIO_ROOT_USER: ${MINIO_ROOT_USER}
      MINIO_ROOT_PASSWORD: ${MINIO_ROOT_PASSWORD}
    volumes:
      - minio_data:/data
    ports:
      - "9000:9000"
      - "9001:9001"
    restart: unless-stopped

volumes:
  pg_data:
  redis_data:
  minio_data:
```

### 1.3 Kubernetes 部署

```yaml
# k8s/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redhub-server
  namespace: redhub
spec:
  replicas: 3
  selector:
    matchLabels:
      app: redhub-server
  template:
    metadata:
      labels:
        app: redhub-server
    spec:
      containers:
        - name: app
          image: registry.example.com/redhub/server:${TAG}
          ports:
            - containerPort: 8080
          envFrom:
            - configMapRef:
                name: redhub-config
            - secretRef:
                name: redhub-secrets
          resources:
            requests:
              cpu: 500m
              memory: 512Mi
            limits:
              cpu: 2000m
              memory: 2Gi
          livenessProbe:
            httpGet:
              path: /healthz
              port: 8080
            initialDelaySeconds: 10
            periodSeconds: 15
          readinessProbe:
            httpGet:
              path: /readyz
              port: 8080
            initialDelaySeconds: 5
            periodSeconds: 10
---
apiVersion: v1
kind: Service
metadata:
  name: redhub-svc
  namespace: redhub
spec:
  selector:
    app: redhub-server
  ports:
    - port: 80
      targetPort: 8080
  type: ClusterIP
```

### 1.4 Helm Chart 结构

```text
helm/redhub/
├── Chart.yaml
├── values.yaml           # 默认值
├── values-staging.yaml   # Staging 覆盖
├── values-prod.yaml      # 生产覆盖
└── templates/
    ├── deployment.yaml
    ├── service.yaml
    ├── ingress.yaml
    ├── hpa.yaml          # 自动扩缩容
    ├── configmap.yaml
    ├── secret.yaml
    └── servicemonitor.yaml  # Prometheus 监控
```

部署命令：

```bash
# Staging
helm upgrade --install redhub ./helm/redhub \
  --namespace redhub \
  --values helm/redhub/values-staging.yaml \
  --set image.tag=v1.0.0-rc1

# Production
helm upgrade --install redhub ./helm/redhub \
  --namespace redhub \
  --values helm/redhub/values-prod.yaml \
  --set image.tag=v1.0.0 \
  --wait --timeout 300s
```

## 2. Mode-D 大客户独立部署

### 2.1 交付物清单

```text
redhub-dedicated-v{version}/
├── redhub-server                    # Rust 编译产物（Linux amd64/aarch64）
├── config/
│   ├── default.toml                 # 默认配置模板
│   └── production.toml              # 生产环境配置模板
├── migrations/                      # 数据库迁移脚本（SeaORM 导出）
│   ├── m001_initial.sql
│   └── ...
├── docker-compose.yml               # 可选容器化部署
├── install.sh                       # 一键安装脚本
├── backup.sh                        # 备份脚本
├── restore.sh                       # 恢复脚本
├── systemd/
│   └── redhub.service              # Systemd 服务单元文件
└── README.md                        # 安装说明
```

### 2.2 配置文件模板

```toml
# config/default.toml
[server]
host = "0.0.0.0"
port = 8080
workers = 4

[database]
url = "postgres://redhub:password@localhost:5432/redhub"
max_connections = 20
min_connections = 5

[redis]
url = "redis://localhost:6379"

[jwt]
secret = "CHANGE_ME_IN_PRODUCTION"
access_token_expiry_secs = 1800     # 30 minutes
refresh_token_expiry_secs = 604800  # 7 days

[deploy]
mode = "dedicated"                   # shared | dedicated

[s3]
endpoint = "http://localhost:9000"
access_key = ""
secret_key = ""
bucket = "redhub"

[ai]
sunlab_url = ""                     # Sunlab Agent 平台地址
sunlab_api_key = ""

[log]
level = "info"
format = "json"

[security]
cors_origins = ["https://your-domain.com"]
rate_limit_per_minute = 600
```

### 2.3 一键安装脚本

```bash
#!/bin/bash
set -euo pipefail

echo "=== RedHub 独立部署安装 ==="

# 检查依赖
command -v psql >/dev/null 2>&1 || { echo "PostgreSQL client is required"; exit 1; }
command -v redis-cli >/dev/null 2>&1 || { echo "Redis client is required"; exit 1; }

# 创建系统用户
id -u redhub &>/dev/null || useradd -r -s /bin/false redhub

# 创建目录
mkdir -p /opt/redhub/{config,data,logs}
cp -r ./* /opt/redhub/
chown -R redhub:redhub /opt/redhub

# 初始化数据库
read -p "Enter PostgreSQL host [localhost]: " PG_HOST; PG_HOST=${PG_HOST:-localhost}
read -p "Enter PostgreSQL port [5432]: " PG_PORT; PG_PORT=${PG_PORT:-5432}
read -p "Enter database name [redhub]: " PG_DB; PG_DB=${PG_DB:-redhub}
read -sp "Enter PostgreSQL password: " PG_PASS; echo

PG_URL="postgres://redhub:${PG_PASS}@${PG_HOST}:${PG_PORT}/${PG_DB}"

# 运行数据库迁移
psql "${PG_URL}" -f migrations/*.sql

# 更新配置
sed -i "s|DATABASE_URL_PLACEHOLDER|${PG_URL}|g" /opt/redhub/config/production.toml

# 安装 Systemd 服务
cp systemd/redhub.service /etc/systemd/system/
systemctl daemon-reload
systemctl enable redhub
systemctl start redhub

echo "=== 安装完成 ==="
echo "服务状态: $(systemctl status redhub --no-pager)"
echo "健康检查: curl http://localhost:8080/healthz"
```

### 2.4 Systemd 服务

```ini
# systemd/redhub.service
[Unit]
Description=RedHub Server
After=network.target postgresql.service redis.service

[Service]
Type=simple
User=redhub
Group=redhub
WorkingDirectory=/opt/redhub
ExecStart=/opt/redhub/redhub-server --config /opt/redhub/config/production.toml
Restart=always
RestartSec=5
LimitNOFILE=65536
Environment=RUST_LOG=info

[Install]
WantedBy=multi-user.target
```

## 3. CI/CD 流水线

### 3.1 构建流程

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy

on:
  push:
    tags: ['v*']

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Rust
        uses: dtolnay/rust-toolchain@stable
        with:
          targets: x86_64-unknown-linux-musl,aarch64-unknown-linux-musl

      - name: Build (amd64)
        run: cargo build --release --target x86_64-unknown-linux-musl

      - name: Build (arm64)
        run: cargo build --release --target aarch64-unknown-linux-musl

      - name: Package Mode-D deliverable
        run: |
          mkdir -p dist/redhub-dedicated-${{ github.ref_name }}
          cp target/x86_64-unknown-linux-musl/release/redhub-server dist/redhub-dedicated-${{ github.ref_name }}/
          cp -r migrations config systemd install.sh backup.sh restore.sh dist/redhub-dedicated-${{ github.ref_name }}/

      - name: Build Docker image
        run: |
          docker build -t registry.example.com/redhub/server:${{ github.ref_name }} .
          docker push registry.example.com/redhub/server:${{ github.ref_name }}

      - name: Upload artifacts
        uses: actions/upload-artifact@v4
        with:
          name: redhub-dedicated-${{ github.ref_name }}
          path: dist/
```

### 3.2 发布策略

| 环境 | 触发方式 | 审核 |
|------|----------|------|
| dev | push to develop 自动部署 | 无需审核 |
| staging | tag rc* 自动部署 | 无需审核 |
| production | tag v* 手动触发 | 至少 1 人审批 |

### 3.3 回滚流程

```bash
# Helm 回滚
helm rollback redhub --namespace redhub

# Docker Compose 回滚
TAG=v1.0.0-previous docker-compose up -d

# Mode-D 二进制回滚
systemctl stop redhub
cp redhub-server.bak redhub-server
systemctl start redhub
```

## 4. 备份与恢复

### 4.1 备份策略

| 类型 | 频率 | 保留期 | 工具 |
|------|------|--------|------|
| PostgreSQL 全量备份 | 每日 02:00 | 30 天 | pg_dump |
| PostgreSQL WAL 归档 | 连续 | 7 天 | wal-g / pgBackRest |
| Redis RDB | 每小时 | 24 小时 | Redis 内置持久化 |
| 对象存储 | 版本控制 | 按策略 | MinIO/OSS 版本化 |

### 4.2 备份脚本

```bash
#!/bin/bash
# backup.sh
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/redhub/backups"
RETENTION_DAYS=30

mkdir -p "$BACKUP_DIR"

# PostgreSQL dump
pg_dump "$DATABASE_URL" | gzip > "$BACKUP_DIR/pg_${TIMESTAMP}.sql.gz"

# 清理过期备份
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +${RETENTION_DAYS} -delete

echo "Backup completed: pg_${TIMESTAMP}.sql.gz"
```

## 5. 监控接入

详细方案见 OPS-02，此处列出部署层面的配置：

```yaml
# Prometheus ServiceMonitor
apiVersion: monitoring.coreos.com/v1
kind: ServiceMonitor
metadata:
  name: redhub-metrics
spec:
  selector:
    matchLabels:
      app: redhub-server
  endpoints:
    - port: http
      path: /metrics
      interval: 30s
```

健康检查端点：

| 端点 | 用途 | 检查内容 |
|------|------|----------|
| `/healthz` | 存活探针 | 进程是否运行 |
| `/readyz` | 就绪探针 | DB 连接 + Redis 连接是否正常 |
| `/metrics` | 指标暴露 | Prometheus 格式指标 |
