# TA-08 SDUI 动态渲染引擎详细设计

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 架构模式 | Server-Driven UI (参考 Airbnb Ghost Platform / Lyft Canvas) |
| 上游依赖 | TA-01, FE-01 |
| 合规性 | 纯数据驱动，无代码注入，符合微信小程序审核规范 |

---

## 1. 架构总览

```text
┌─────────────────────────────────────────────────────────────────────┐
│                    ADM 管理端 — 可视化页面编辑器                       │
│                                                                     │
│  ┌───────────┐   ┌──────────────┐   ┌──────────────────────┐       │
│  │ 区块面板    │   │ 拖拽画布      │   │ 属性配置面板           │       │
│  │ (Block     │   │ (实时预览)    │   │ (Props/Data/Action)  │       │
│  │  Palette)  │──►│              │◄──│                      │       │
│  └───────────┘   └──────┬───────┘   └──────────────────────┘       │
│                         │ 序列化                                     │
├─────────────────────────▼───────────────────────────────────────────┤
│                        服务端（Rust）                                 │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                   Schema 编排引擎                              │   │
│  │                                                              │   │
+│  │  ┌──────────┐  ┌───────────┐  ┌────────────┐               │   │
│  │  │ Version   │  │ AB Router  │  │ Capability  │               │   │
│  │  │ Manager   │  │ (灰度路由)  │  │ Negotiator  │               │   │
│  │  └──────────┘  └───────────┘  └────────────┘               │   │
│  │  ┌──────────┐  ┌───────────┐                              │   │
│  │  │ Data      │  │ Payload    │                             │   │
│  │  │ Aggregator│  │ Compressor │                             │   │
│  │  └──────────┘  └───────────┘                              │   │
│  └──────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│                      客户端（Cool Unix / UTS）                        │
│                                                                     │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │                 渲染管线（Rendering Pipeline）                  │   │
│  │                                                              │   │
│  │  Network → Cache Check → Schema Parse → Diff Engine          │   │
│  │                ↓                                ↓             │   │
│  │          Local Fallback              Virtual Tree Rebuild     │   │
│  │          (离线兜底模板)                          ↓             │   │
│  │                                      Native Component Map     │   │
│  │                                                ↓             │   │
│  │                                        Reactive Binder        │   │
│  │                                                ↓             │   │
│  │                                          Render Output       │   │
│  └──────────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Schema 协议设计

### 2.1 核心概念模型

参考 Airbnb 的三元素模型，定义四种顶层实体：

```typescript
/// 页面 = 多个 Section 按布局排列
interface ScreenSchema {
  screen_id: string;
  screen_version: string;         // semver 格式 "1.2.0"
  layout: LayoutType;             // vertical_stack / horizontal_scroll / tab_container
  sections: SectionInstance[];
}

/// Section = 一组逻辑相关的组件集合（独立的数据域）
interface SectionInstance {
  section_id: string;
  section_type: string;           // 对应注册的 Section 组件类型
  props: Record<string, PropValue>;
  children?: BlockNode[];         // 嵌套子组件树
  visibility: VisibilityRule;     // 条件显隐规则
}

/// Block = 叶子级 UI 原子组件
interface BlockNode {
  block_id: string;
  block_type: string;             // banner / grid_menu / card_list / ...
  props: Record<string, PropValue>;
  style?: StyleToken[];           // 设计 Token 引用而非内联样式
  actions?: ActionBinding[];      // 用户交互事件绑定
}

/// Action = 声明式用户交互响应
interface ActionBinding {
  trigger: "tap" | "long_press" | "pull_refresh" | "scroll_end";
  action_chain: ActionStep[];     // 可组合的操作链
}
```

### 2.2 版本协商协议

客户端与服务器通过能力版本号协商可用的 Schema 结构：

```text
客户端启动时上报：
GET /api/v1/sdui/screen/home?client_version=1.0.0&platform=mp-weixin&app_build=42

服务端响应：
{
  "schema_version": "2.1.0",       // 当前最新 Schema 协议版本
  "min_supported": "1.0.0",       // 服务端支持的最低客户端版本
  "screen": { ... },              // 编译后的页面 Schema
  "data_sources": { ... },        // 预取的数据（见第4节）
  "cache_ttl_seconds": 300,       // 建议缓存时长
}
```

如果客户端版本过低无法解析新 Schema 结构，服务端降级返回兼容版本。

---

## 3. 组件注册表（Component Registry）

### 3.1 客户端注册表

每个区块类型在编译时静态注册到映射表中：

```typescript
// rdl/registry.ts
import BannerBlock from './blocks/BannerBlock.uvue';
import GridMenuBlock from './blocks/GridMenuBlock.uvue';
import CardListBlock from './blocks/CardListBlock.uvue';
import NoticeBarBlock from './blocks/NoticeBarBlock.uvue';
import DataSummaryBlock from './blocks/DataSummaryBlock.uvue';

const BLOCK_REGISTRY: Record<string, any> = {
  'banner': BannerBlock,
  'grid_menu': GridMenuBlock,
  'card_list': CardListBlock,
  'notice_bar': NoticeBarBlock,
  'data_summary': DataSummaryBlock,
};

export function getComponent(type: string): any {
  return BLOCK_REGISTRY[type] ?? FallbackBlock; // 未知类型降级
}
```

### 3.2 渲染器（v-if 条件链）

由于 uni-app x 不支持 `<component :is>`，使用编译时确定的条件链：

```vue
<!-- DynamicRenderer.uvue -->
<template>
  <scroll-view class="flex-1" @scrolltolower="onScrollEnd">
    <template v-for="section in screen.sections" :key="section.section_id">

      <!-- 可见性判断 -->
      <template v-if="isVisible(section.visibility)">

        <!-- Section 类型分派 -->
        <HeroSection v-if="section.section_type === 'hero'" :config="section" />
        <ContentFeed v-else-if="section.section_type === 'content_feed'" :config="section" />
        <StatsOverview v-else-if="section.section_type === 'stats'" :config="section" />
        <QuickActionsSection v-else-if="section.section_type === 'quick_actions'" :config="section" />

        <!-- 通用 Section：遍历子 Block -->
        <GenericSection v-else :config="section">
          <template v-for="block in section.children ?? []" :key="block.block_id">
            <!-- Block 类型分派 -->
            <BannerBlock v-if="block.block_type === 'banner'" :props="block.props" />
            <GridMenuBlock v-else-if="block.block_type === 'grid_menu'" :props="block.props" />
            <CardListBlock v-else-if="block.block_type === 'card_list'"
                           :props="block.props"
                           @itemTap="handleAction(block.actions, $event)" />
            <NoticeBarBlock v-else-if="block.block_type === 'notice_bar'" :props="block.props" />
            <FallbackBlock v-else :type="block.block_type" />
          </template>
        </GenericSection>

      </template>
    </template>
  </scroll-view>
</template>
```

---

## 4. Action 管线（声明式事件处理）

### 4.1 操作链模型

用户交互触发一系列原子操作的有序执行：

```json
{
  "trigger": "tap",
  "action_chain": [
    { "action": "navigate", "params": { "route": "/activity/detail?id=${item.id}" } },
    { "action": "track_analytics", "params": { "event": "activity_card_tap", "item_id": "${item.id}" } }
  ]
}
```

### 4.2 内置 Action 类型

| Action | 参数 | 说明 |
|--------|------|------|
| `navigate` | route | 页面跳转 |
| `open_url` | url | 打开外部链接 |
| `show_toast` | message | 显示提示 |
| `show_confirm` | title, content, confirm_action | 弹出确认框后执行后续操作 |
| `submit_form` | form_id | 提交表单 |
| `refresh_section` | section_id | 刷新指定 Section 数据 |
| `track_analytics` | event, params | 埋点上报 |

### 4.3 执行器实现

```typescript
class ActionExecutor {
    private context: Record<string, any>; // item, user, tenant 等

    async executeChain(steps: ActionStep[]): Promise<void> {
        for (const step of steps) {
            switch (step.action) {
                case 'navigate':
                    const route = this.interpolate(step.params.route, this.context);
                    uni.navigateTo({ url: route });
                    break;
                case 'show_confirm':
                    const confirmed = await this.showConfirm(step.params);
                    if (!confirmed) return; // 取消则中断链
                    break;
                case 'track_analytics':
                    analytics.track(
                        step.params.event,
                        this.interpolateParams(step.params)
                    );
                    break;
                default:
                    console.warn(`Unknown action: ${step.action}`);
            }
        }
    }

    /// 模板字符串插值："/detail?id=${item.id}" → "/detail?id=xxx"
    private interpolate(template: string, ctx: Record<string, any>): string {
        return template.replace(/\$\{(\w+(?:\.\w+)*)\}/g, (_, path) => {
            return path.split('.').reduce((obj: any, key: string) => obj?.[key], ctx) ?? '';
        });
    }
}
```

---

## 5. 数据绑定层

### 5.1 数据源声明

每个 Section 可以声明自己的数据来源：

```json
{
  "section_id": "activities_feed",
  "section_type": "content_feed",
  "data_source": {
    "endpoint": "/api/v1/service/activities",
    "method": "GET",
    "params": { "limit": 10, "status": "published" },
    "refresh_trigger": ["pull_refresh", "screen_focus"],
    "pagination": {
      "mode": "cursor",
      "cursor_field": "next_cursor",
      "load_more_trigger": "scroll_end"
    },
    "transform": "$.data.list[*]"
  }
}
```

### 5.2 服务端数据预聚合

为减少客户端请求数，服务端可以将多个 Section 的数据合并为一次响应：

```rust
pub async fn get_screen_with_data(
    state: &AppState,
    screen_name: &str,
    tenant_id: Uuid,
    user_context: &UserContext,
) -> Result<ScreenResponse> {
    let schema = state.schema_service.get_schema(screen_name, tenant_id).await?;

    // 收集所有 Section 声明的数据源
    let endpoints = extract_endpoints(&schema);
    let mut data_map = HashMap::new();

    // 并发请求所有数据源（内部调用，无网络开销）
    for endpoint in endpoints {
        let data = state.internal_api.call(&endpoint, user_context).await?;
        data_map.insert(endpoint.path.clone(), data);
    }

    Ok(ScreenResponse {
        schema,
        data_sources: data_map,
        cache_ttl: Duration::from_secs(300),
    })
}
```

---

## 6. Diff 引擎与增量更新

### 6.1 Schema Diff

当新 Schema 到达时，对比当前已渲染的 Virtual Tree，仅更新变化的部分：

```typescript
class SchemaDiffer {
    /// 对比新旧两个 Section 树，输出变更指令列表
    diff(oldTree: SectionInstance[], newTree: SectionInstance[]): PatchOperation[] {
        const patches: PatchOperation[] = [];

        // 使用 section_id 作为 key 进行 keyed diff
        const oldMap = new Map(oldTree.map(s => [s.section_id, s]));
        const newMap = new Map(newTree.map(s => [s.section_id, s]));

        // 新增
        for (const [id, node] of newMap) {
            if (!oldMap.has(id)) {
                patches.push({ op: 'insert', index: newTree.indexOf(node), node });
            }
        }

        // 删除
        for (const [id] of oldMap) {
            if (!newMap.has(id)) {
                patches.push({ op: 'remove', id });
            }
        }

        // 更新（递归比较 props 和 children）
        for (const [id, newNode] of newMap) {
            const oldNode = oldMap.get(id);
            if (oldNode && !this.deepEqual(oldNode.props, newNode.props)) {
                patches.push({ op: 'replace_props', id, props: newNode.props });
            }
            // 递归处理 children...
        }

        // 移动（排序变化）
        // ...

        return patches;
    }
}

interface PatchOperation {
    op: 'insert' | 'remove' | 'replace_props' | 'move' | 'replace_style';
    id?: string;
    index?: number;
    node?: SectionInstance;
    props?: Record<string, any>;
}
```

---

## 7. 缓存策略（三层）

```text
Layer 1: 内存缓存（活跃 Session）
  ├── key: screen_name + schema_version
  ├── TTL: 页面生命周期
  └── 用途：页面切换回来时秒开

Layer 2: 本地持久缓存（Storage）
  ├── key: `sdui:{tenant_id}:{screen_name}`
  ├── value: { schema, data, cached_at }
  ├── TTL: 服务端下发的 cache_ttl_seconds（默认 300s）
  └── 用途：冷启动时先渲染缓存版本再后台刷新

Layer 3: 离线兜底模板
  ├── 编译时打包内置的默认首页模板
  ├── 仅包含静态内容（Banner 占位图、宫格导航、空状态）
  └── 用途：首次安装且无网时的最低可用体验
```

```typescript
class SDUICacheManager {
    async load(screenName: string): Promise<ScreenResponse> {
        // L1: 内存
        let cached = this.memoryCache.get(screenName);
        if (cached && !this.isExpired(cached)) return cached;

        // L2: Storage
        const storageKey = `sdui:${this.tenantId}:${screenName}`;
        cached = await uni.getStorageSync(storageKey);
        if (cached && !this.isExpired(cached)) {
            this.memoryCache.set(screenName, cached);
            // 后台静默刷新
            this.refreshInBackground(screenName);
            return cached;
        }

        // L3: 网络
        try {
            const fresh = await this.fetchFromServer(screenName);
            await uni.setStorageSync(storageKey, fresh);
            this.memoryCache.set(screenName, fresh);
            return fresh;
        } catch (e) {
            // 网络失败，使用离线兜底模板
            return this.getFallbackTemplate(screenName);
        }
    }
}
```

---

## 8. 可视化编辑器协议

### 8.1 编辑器 ↔ 后端通信

```text
# 获取可用区块类型及其属性元数据
GET /api/v1/sdui/blocks/catalog
→ 返回每个 block_type 的 JSON Schema 定义（用于编辑器自动生成表单）

# 保存页面配置
PUT /api/v1/sdui/screens/{name}/schema
Body: { "schema": ScreenSchema, "version_note": "调整活动卡片位置" }

# 发布到租户
POST /api/v1/sdui/screens/{name}/publish
Body: { "target_tenants": ["uuid-a"], "rollout_percentage": 100 }
```

### 8.2 区块目录（Block Catalog）

服务端维护一份机器可读的区块元数据，编辑器据此生成配置表单：

```json
{
  "block_type": "card_list",
  "display_name": "卡片列表",
  "icon": "list",
  "description": "展示一组卡片，支持分页加载",
  "props_schema": {
    "title": { "type": "string", "label": "标题", "required": false },
    "dataSource": {
      "type": "string",
      "label": "数据接口",
      "widget": "api_selector",
      "options": "/api/v1/internal/endpoints"
    },
    "itemLayout": {
      "type": "enum",
      "label": "卡片样式",
      "values": ["horizontal", "vertical", "compact"],
      "default": "horizontal"
    },
    "maxItems": { "type": "number", "label": "最大条数", "default": 10 }
  },
  "actions_schema": {
    "on_item_tap": { "label": "点击卡片", "available_actions": ["navigate", "show_toast"] }
  },
  "preview_image": "/static/previews/card-list.png"
}
```

---

## 9. A/B 测试与灰度发布

### 9.1 变体路由

```rust
pub struct AbTestRouter {
    experiments: Vec<AbExperiment>,
}

pub struct AbExperiment {
    pub experiment_id: String,
    pub screen_name: String,
    pub variants: Vec<SchemaVariant>,
    pub traffic_split: Vec<u32>,       // 百分比分配 [50, 50]
    pub target_tenant_ids: Option<Vec<Uuid>>, // 限定租户范围
}

impl AbTestRouter {
    pub fn resolve_variant(
        &self,
        screen_name: &str,
        tenant_id: Uuid,
        user_hash: u64, // 用户 ID hash 用于稳定分组
    ) -> Option<&SchemaVariant> {
        let experiment = self.experiments.iter()
            .find(|e| e.screen_name == screen_name && e.matches_tenant(tenant_id))?;

        let bucket = user_hash % 100;
        let mut cumulative = 0;
        for (i, pct) in experiment.traffic_split.iter().enumerate() {
            cumulative += pct;
            if bucket < cumulative {
                return Some(&experiment.variants[i]);
            }
        }
        None
    }
}
```

---

## 10. 性能优化策略

### 10.1 Schema 压缩

```rust
use flate2::write::GzEncoder;

pub fn compress_payload(schema: &str) -> Vec<u8> {
    let mut encoder = GzEncoder::new(Vec::new(), Compression::best());
    encoder.write_all(schema.as_bytes()).unwrap();
    encoder.finish().unwrap()
}
```

响应头设置 `Content-Encoding: gzip`；客户端自动解压。

### 10.2 预取策略

```typescript
// 在首页加载完成后预取下一屏可能的 Schema
async function prefetchNextScreens(currentScreen: string) {
    const prefetchMap: Record<string, string[]> = {
        'home': ['learning/index', 'party/meeting'],
        'party/meeting': ['meeting/detail'],
    };
    const next = prefetchMap[currentScreen] ?? [];
    next.forEach(screen => sduiCache.prefetch(screen));
}
```

---

## 11. 安全约束

| 约束项 | 实现 |
|--------|------|
| Schema 来源校验 | 服务端签名（HMAC），客户端验证防篡改 |
| 数据源白名单 | 服务端编译时提取所有 endpoint URL，仅允许白名单内的 API |
| Props 大小限制 | 单个 Section payload ≤ 100KB |
| 无代码执行 | Schema 中不包含任何可执行代码；Action 仅支持白名单中的操作 |
| 租户隔离 | Schema 按 tenant_id 存储；跨租户不可访问 |

---

## 12. 与传统方案的对比优势总结

| 维度 | 传统硬编码 | 简单 JSON 配置 | 本方案 SDUI |
|------|-----------|---------------|-------------|
| 页面结构灵活性 | ❌ 固定 | ⚠️ 仅顺序和显隐 | ✓ 嵌套 + 布局切换 + 条件逻辑 |
| 数据获取 | 手动编码 | 手动编码 | 声明式数据源 + 服务端聚合 |
| 交互行为 | 手动编码 | ❌ 不支持 | ✓ 声明式 Action 链 |
| 更新方式 | 发版 | 发版 | 实时推送 |
| A/B 测试 | 不可能 | 不可能 | 内置灰度路由 |
| 离线能力 | 天然支持 | 不支持 | 三层缓存 + 兜底模板 |
| 性能优化空间 | N/A | N/A | Diff 增量更新 + 压缩 + 预取 |
