# PM-03 UI/UX 设计规范

| 属性 | 值 |
|------|-----|
| 文档版本 | V1.0 |
| 上游依赖 | PM-01 产品需求文档 |
| 下游消费者 | FE-01 (移动端), FE-02 (管理端) |
| 设计原则 | 政务严肃感 + 现代简洁 + 无障碍友好 |

---

## 1. 设计原则

1. **庄重而不呆板**：以红色系为主色，搭配留白和圆角，保持政务属性的同时提供现代体验。
2. **信息层级清晰**：核心数据突出显示，辅助信息弱化，避免视觉噪音。
3. **操作路径最短**：高频操作（签到、报名、查看通知）在 3 次点击内完成。
4. **无障碍优先**：文字对比度 ≥ WCAG AA 标准（4.5:1）；按钮最小触控区域 44×44px。
5. **暗黑模式一等公民**：所有页面必须适配暗黑模式，非可选。

---

## 2. 色彩系统

### 2.1 主色调

| Token | 亮色模式 | 暗色模式 | 用途 |
|-------|----------|----------|------|
| `--color-primary` | #C41E3A | #E85A6B | 品牌主按钮、导航栏、关键强调 |
| `--color-primary-hover` | #9B1428 | #D14B5C | 按钮 hover 状态 |
| `--color-secondary` | #F5D547 | #F0C830 | 金色点缀（勋章、积分） |
| `--color-accent` | #1A6FB5 | #4DA3E8 | 链接、次要按钮 |

### 2.2 功能色

| Token | 值 | 用途 |
|-------|-----|------|
| `--color-success` | #22C55E | 成功状态、已审批 |
| `--color-warning` | #F59E0B | 警告、待处理 |
| `--color-danger` | #EF4444 | 错误、驳回 |
| `--color-info` | #3B82F6 | 提示、进行中 |

### 2.3 中性色

| Token | 亮色 | 暗色 | 用途 |
|-------|------|------|------|
| `--color-bg` | #F7F7F7 | #121212 | 页面背景 |
| `--color-card` | #FFFFFF | #1E1E1E | 卡片背景 |
| `--color-border` | #E5E7EB | #374151 | 边框 |
| `--color-text-primary` | #111827 | #F3F4F6 | 主要文字 |
| `--color-text-secondary` | #6B7280 | #9CA3AF | 次要文字 |
| `--color-text-disabled` | #D1D5DB | #4B5563 | 禁用文字 |

### 2.4 党员身份标识色

| 类型 | 色值 | 说明 |
|------|------|------|
| 正式党员 | #C41E3A (primary) | 标准红 |
| 预备党员 | #F59E0B (warning) | 橙黄 |
| 入党申请人 | #6B7280 (gray) | 灰色 |
| 流动党员 | #3B82F6 (info) | 蓝色标签 |

---

## 3. 字体排版

### 3.1 字体栈

```css
font-family: -apple-system, BlinkMacSystemFont, "PingFang SC",
             "Hiragino Sans GB", "Microsoft YaHei", sans-serif;
```

### 3.2 字号层级

| Token | 小程序/App | 管理端 | 行高 | 字重 | 用途 |
|-------|-----------|--------|------|------|------|
| `text-display` | 28px | 32px | 1.3 | Bold | 大标题（驾驶舱指标数） |
| `text-h1` | 22px | 24px | 1.4 | SemiBold | 页面标题 |
| `text-h2` | 18px | 20px | 1.4 | SemiBold | 卡片标题 / 区块标题 |
| `text-h3` | 16px | 16px | 1.5 | Medium | 列表项标题 |
| `text-body` | 14px | 14px | 1.6 | Regular | 正文内容 |
| `text-caption` | 12px | 12px | 1.5 | Regular | 辅助说明、时间戳 |
| `text-micro` | 10px | 10px | 1.4 | Regular | 角标、极小标签 |

---

## 4. 间距与布局

### 4.1 间距系统

基于 4px 网格：

```text
space-1 = 4px
space-2 = 8px
space-3 = 12px
space-4 = 16px
space-5 = 20px
space-6 = 24px
space-8 = 32px
space-10 = 40px
space-12 = 48px
```

### 4.2 页面结构规范

**小程序/App：**
```text
┌─────────────────────┐
│     Topbar (56px)    │
├─────────────────────┤
│                     │
│   Content Area      │  padding: space-4 (16px)
│   scrollable        │
│                     │
├─────────────────────┤
│    Tabbar (50px+safe-area) │
└─────────────────────┘
```

**管理端：**
```text
┌────────┬───────────────────────────┐
│        │  Header (64px)             │
│ Sidebar ├───────────────────────────┤
│ 240px  │                           │
│ fixed  │  Content                  │
│        │  padding: space-6 (24px)   │
│        │  max-width: 1440px         │
│        │                           │
└────────┴───────────────────────────┘
```

---

## 5. 组件设计 Token

### 5.1 圆角

| Token | 值 | 用途 |
|-------|-----|------|
| `rounded-sm` | 6px | Tag, Badge |
| `rounded-md` | 10px | Input, Select, Button(small) |
| `rounded-lg` | 14px | Card, Modal, Popup |
| `rounded-full` | 9999px | Avatar, Pill button |

### 5.2 阴影

| Token | 亮色 | 暗色 |
|-------|------|------|
| `shadow-sm` | 0 1px 3px rgba(0,0,0,.08) | 0 1px 3px rgba(0,0,0,.4) |
| `shadow-md` | 0 4px 12px rgba(0,0,0,.08) | 0 4px 12px rgba(0,0,0,.4) |
| `shadow-lg` | 0 8px 24px rgba(0,0,0,.1) | 0 8px 24px rgba(0,0,0,.5) |

暗色模式下阴影加深以保证层次感。

### 5.3 按钮规格

| 变体 | 背景 | 文字 | 高度(移动端) | 高度(Web) | 圆角 |
|------|------|------|-------------|----------|------|
| Primary | primary | white | 44px | 36px | rounded-md |
| Secondary | transparent | accent | 44px | 36px | rounded-md, border |
| Danger | danger | white | 44px | 36px | rounded-md |
| Ghost | transparent | text-primary | 44px | 32px | rounded-md |
| Disabled | border | text-disabled | 同上 | 同上 | 同上 |

### 5.4 表单元素

| 元素 | 高度 | 圆角 | 聚焦态 |
|------|------|------|--------|
| Input | 44px (mobile) / 36px (web) | rounded-md | border-color: primary; box-shadow: 0 0 0 2px rgba(primary, .15) |
| Textarea | min 88px | rounded-md | 同上 |
| Select | 同 Input | 同 Input | 展开下拉面板 shadow-md |
| Switch | 宽 52px 高 32px | rounded-full | 开启时背景 primary |
| Checkbox/Radio | 22×22px | — | 选中时填充 primary |

---

## 6. 图标规范

### 6.1 图标来源

- Cool Unix 内置 RemixIcon
- 自定义 Iconfont（政务特色图标：党旗、党徽等）

### 6.2 使用规则

| 尺寸 | 用途 |
|------|------|
| 16px | 行内图标、Tag 前缀 |
| 20px | Tabbar 默认状态 |
| 24px | Tabbar 激活状态、按钮前缀 |
| 32px+ | 空状态插图、功能入口大图标 |

颜色遵循文字色或功能色；禁止使用纯灰色以外的低对比度色。

---

## 7. 动效

### 7.1 时长与缓动

| Token | Duration | Easing | 用途 |
|-------|----------|--------|------|
| `motion-fast` | 150ms | ease-out | 按钮 hover/active |
| `motion-normal` | 250ms | ease-in-out | 页面切换、卡片展开 |
| `motion-slow` | 400ms | cubic-bezier(.4,0,.2,1) | 弹窗出现、底部抽屉 |

### 7.2 微交互

| 场景 | 动效 |
|------|------|
| 按钮点击 | scale(0.97) + opacity(.85) |
| 列表加载 | Skeleton → 内容淡入 (fade-in 200ms) |
| 签到成功 | 打勾动画 (Lottie) + Toast 弹出 |
| 积分增加 | 数字滚动 (RollingNumber) |
| 下拉刷新 | 自定义旋转动画 |

---

## 8. 页面模板参考

### 8.1 首页（小程序）

```text
┌──────────────────────────────┐
│  [Logo] 党务服务中心   🔔(3)  │
├──────────────────────────────┤
│                              │
│  ┌─ Banner 轮播图 ────────┐  │
│  │  党建活动宣传图          │  │
│  └────────────────────────┘  │
│                              │
│  快捷入口                    │
│  ┌──┐ ┌──┐ ┌──┐ ┌──┐       │
│  │学习│ │三会一课│ │活动│ │办事│ │
│  └──┘ └──┘ └──┘ └──┘       │
│                              │
│  📢 最新通知                 │
│  ● 关于开展主题党日活动的通知  │
│                              │
│  🔥 热门活动                 │
│  [卡片] [卡片]               │
│                              │
├──────────────────────────────┤
│  🏠首页  📖学习  📋工作台  👤我 │
└──────────────────────────────┘
```

### 8.2 空状态

| 场景 | 插图 | 文案 | 操作 |
|------|------|------|------|
| 无待办 | 📭 | 暂无待办事项 | — |
| 无搜索结果 | 🔍 | 未找到相关内容 | 清除筛选 |
| 无权限 | 🔒 | 您暂无访问权限 | 返回首页 |
| 网络错误 | 📡 | 网络连接失败 | 重试按钮 |

### 8.3 加载策略

- 首次加载：Skeleton 骨架图（形状匹配实际内容）
- 分页加载：底部 Loadmore 组件
- 操作提交：Button loading 态，防止重复提交
