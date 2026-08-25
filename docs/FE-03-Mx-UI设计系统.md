# FE-03 Mx UI 设计系统

| 属性 | 内容 |
| --- | --- |
| 版本 | V1.1 |
| 上游规范 | PM-03 UI/UX 设计规范 |
| 实现目录 | `mobile/uni_modules/mx-ui` |
| 运行时 | uni-app x / UTS / Tailwind Token |

## 1. 目标

- 把政务红视觉、暗黑模式和 App 级触控体验固化为可复用组件。
- 让业务代码只组合语义组件，不直接复制颜色、圆角、间距和状态样式。
- 保证微信小程序、App、H5 使用同一套 API 和验收标准。

## 2. 设计令牌

### 2.1 颜色

| Token | 值 | 用途 |
| --- | --- | --- |
| `primary-500` | `#C41E3A` | 主操作、品牌强调、选中态 |
| `primary-50` | `#FFF1F3` | 图标底色、浅色背景 |
| success | `#22C55E` | 完成、通过、上升 |
| warning | `#F59E0B` | 待处理、审核中 |
| danger | `#EF4444` | 错误、驳回、下降 |
| surface-0 / surface-800 | `#FFFFFF` / `#1E293B` | 亮色卡片 / 暗色卡片 |

### 2.2 布局

| Token | 值 | 用途 |
| --- | --- | --- |
| `space-3` | 12px | 组件内紧凑间距 |
| `space-4` | 16px | 页面边距、卡片内边距 |
| `space-6` | 24px | 区块间距 |
| radius-lg | 14px | 卡片、弹窗 |
| touch-min | 44px | 可点击元素最小高度 |

### 2.3 控件状态

| 组件 | 默认尺寸 | 必须支持的状态 |
| --- | --- | --- |
| `mx-button` | small/normal 44px，large 48px | pressed、focus、disabled、loading |
| `mx-input` | 44px | focus、disabled、`invalid`、form error |
| `mx-textarea` | 内容区默认 88px | focus、disabled、`invalid`、form error |
| `mx-tag` | 26px | solid、plain、dark、closable |
| `mx-badge` | 18px；dot 8px | 五类语义色、定位模式 |

`invalid` 用于接口返回、跨字段校验等不依赖 `mx-form-item` 的错误状态；表单规则错误继续由 `useFormItem()` 自动注入。两种来源使用同一错误视觉，不允许业务层复制边框样式。

## 3. 核心容器组件

### 3.1 `mx-card`

用于承载一个完整业务对象或一组强相关字段。

```html
<mx-card title="组织活动" subtitle="近 30 天" shadow>
  <mx-text :size="13">活动内容</mx-text>
  <template #footer>
    <mx-button size="small" text>查看详情</mx-button>
  </template>
</mx-card>
```

规则：

- 一个卡片只表达一个业务主体，不在同一卡片混合多种主操作。
- 默认 `bordered=true`；信息流封面卡可用 `:bordered="false"`。
- 重点卡片使用 `shadow`，普通列表卡片不建议全部加阴影。

### 3.2 `mx-section`

用于页面级内容分组，提供统一的标题、描述和右侧动作。

```html
<mx-section title="常用服务" description="根据身份动态推荐">
  <template #action>
    <mx-button size="small" text>更多</mx-button>
  </template>
</mx-section>
```

规则：

- 相邻 Section 间距固定为 24px。
- 描述只解释上下文，不复述标题。
- 右侧动作最多一个文本按钮或标签。

### 3.3 `mx-metric`

用于关键指标展示，支持趋势方向和图标。

```html
<mx-metric
  label="党员人数"
  value="1286"
  trend="+3.2%"
  trend-type="up"
  icon="group-line"
/>
```

规则：

- 数值必须来自真实数据，不允许在模板里硬编码业务统计。
- `up/down` 只表示数据方向，好坏由产品文案决定。
- 指标卡两列布局时保持等高；一行不超过两个核心指标。

## 4. 质量门槛

1. **双主题**：每个组件必须在亮色和暗色下检查文字对比度。
2. **平台一致**：微信小程序、H5、App 的布局差异必须有条件编译说明。
3. **UCSS 合规**：只用 Flex/绝对定位，禁用 Grid、Float 和继承性文字样式。
4. **类型完备**：新增组件必须导出 `MxXxxProps` 和 PassThrough 类型。
5. **演示覆盖**：新增组件必须进入 `pages/demo/design/system.uvue` 或对应分类演示页。
6. **无障碍**：正文对比度不低于 AA；可点击区域不低于 44×44px。
7. **状态完备**：交互组件必须在设计系统演示页展示 default、pressed/focus、disabled、loading、error 中适用的状态。

## 5. 验收页面

`pages/demo/design/system.uvue` 是 Mx UI 的跨组件验收面，至少覆盖：

- 主动作、次动作、危险动作、加载与禁用按钮。
- 默认、禁用、独立 `invalid` 输入框和多行输入。
- primary/success/warn/error/info 标签、可关闭标签和徽标。
- 页面区块、业务卡片和指标组件在亮暗主题下的组合效果。

## 6. 版本策略

- `mx-ui` 只保留通用 UI 能力，业务字段和接口类型禁止进入该模块。
- 破坏性 Props 必须先新增兼容参数、标记废弃，再在大版本移除。
- 视觉调整需要同步更新 PM-03 与本文件的 Token 表。
