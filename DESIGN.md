---
name: RedHub Mx UI
description: 面向党务与公共服务任务的庄重、现代、清晰的跨端产品设计系统
colors:
  primary: "#C41E3A"
  primary-deep: "#A81630"
  primary-soft: "#FFF1F3"
  accent: "#1A6FB5"
  success: "#22C55E"
  warning: "#F59E0B"
  danger: "#EF4444"
  surface-page: "#FAFAFA"
  surface-card: "#FFFFFF"
  surface-border: "#E4E4E7"
  text-primary: "#18181B"
  text-secondary: "#52525B"
  dark-page: "#18181B"
  dark-card: "#27272A"
  dark-border: "#52525B"
  dark-text: "#FAFAFA"
typography:
  display:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "0"
  headline:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "22px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  title:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "18px"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0"
  body:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "14px"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "-apple-system, BlinkMacSystemFont, PingFang SC, Microsoft YaHei, sans-serif"
    fontSize: "12px"
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: "0"
rounded:
  sm: "6px"
  md: "10px"
  lg: "14px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
  xxl: "32px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.surface-card}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  button-secondary:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.accent}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 16px"
    height: "44px"
  input:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "0 12px"
    height: "44px"
  textarea:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    typography: "{typography.body}"
    rounded: "{rounded.md}"
    padding: "12px"
    height: "88px"
  tag:
    backgroundColor: "{colors.primary-soft}"
    textColor: "{colors.primary-deep}"
    typography: "{typography.label}"
    rounded: "{rounded.sm}"
    padding: "0 10px"
    height: "26px"
  card:
    backgroundColor: "{colors.surface-card}"
    textColor: "{colors.text-primary}"
    rounded: "{rounded.lg}"
    padding: "16px"
---

## Overview

**Creative North Star: “秩序化的服务台”。** RedHub 的界面应像一张被认真整理过的工作台：当前身份、流程状态、任务优先级和下一步操作一眼可见。视觉服务于办事和协作，不承担营销展示职责。

**Key Characteristics:**

- 低噪声的信息结构，清晰区分页面、区块、对象与动作层级。
- 政务红仅用于主动作、选中态和身份信号，蓝色承担链接与信息动作，语义色表达状态。
- App 级触控密度，移动端交互目标不小于 44×44px。
- 亮暗主题采用相同的信息层级和状态词汇，不通过简单反色完成适配。

**The Task Context Rule.** 每个任务页面必须让用户持续看见租户、组织、身份或流程上下文；不能为了“干净”而删掉决定操作含义的信息。

**The One Primary Action Rule.** 一个视口或操作区只保留一个视觉主动作；其他动作降级为描边、文本或菜单。

## Colors

采用克制配色策略：中性表面承载绝大多数内容，政务红占可视面积通常不超过 10%，仅在需要明确引导和确认身份时出现。

**The Crimson Signal Rule.** 政务红是信号，不是背景材质。禁止连续多个大面积红色容器，也禁止让信息、警告和错误共用品牌红表达。

**The Semantic Status Rule.** 成功、待处理、失败和信息必须使用固定语义色并同时配合文字或图标；颜色永远不是唯一信息载体。

暗色主题使用深中性表面和更亮的文字、边框及品牌色。占位文字和次要文字仍需满足其内容等级对应的对比度，不以低对比度制造“高级感”。

## Typography

使用系统中文无衬线字体栈，优先保证跨小程序、App 和 Web 的可读性与稳定渲染。字号遵循 28/22/18/16/14/12px 层级，正文默认 14px、1.6 行高，组件文字不使用负字距。

**The Scannable Hierarchy Rule.** 页面标题、区块标题、对象标题、正文和辅助信息必须至少通过字号、字重和间距中的两项建立差异；禁止只靠颜色深浅区分层级。

**The Plain Language Rule.** 按钮使用明确动词，状态使用业务语言，错误信息说明原因和可执行的下一步。避免“操作失败”“系统异常”这类无行动指引的空泛文案。

## Elevation

界面默认扁平，通过表面色、1px 边框和间距建立层级。阴影只用于浮层、弹窗、固定工具栏或确有悬浮关系的重点对象；普通列表和页面区块禁止批量加阴影。

**The Earned Elevation Rule.** 只有元素确实位于另一个元素之上时才能使用阴影。亮色低层阴影为 `0 1px 3px rgba(0,0,0,.08)`，弹层阴影为 `0 8px 24px rgba(0,0,0,.10)`；暗色主题提高不透明度而不制造发光边缘。

状态动效使用 150ms 快速反馈和 250ms 常规过渡，采用平稳的 ease-out 曲线。按下态允许轻微缩放到 0.97；用户开启减少动态效果后必须移除缩放与位移动画。

## Components

**Buttons.** 移动端默认高度 44px，大按钮 48px；主按钮使用政务红，次按钮使用白色或透明表面配完整边框。必须覆盖默认、按下、聚焦、禁用和加载状态，加载态继续占据原尺寸并阻止重复提交。

**Inputs and Textareas.** 输入框高度 44px，文本域最小高度 88px，使用 10px 圆角和 1px 中性边框。聚焦态同时改变边框和显示可感知聚焦环；错误态使用危险色并由表单项展示错误原因。

**Tags and Badges.** 标签描述分类或状态，使用浅底深字以保持可读性；徽标只承载短数字或提示点。可关闭标签的关闭入口必须具有独立的 44×44px 有效触控区域，不能把 12px 图标直接当作点击目标。

**Cards and Sections.** 卡片只承载一个业务对象或一组强相关字段，圆角不超过 14px。页面区块默认不做成浮动卡；`mx-section` 负责分组，`mx-card` 只用于确有容器语义的内容。

**Navigation.** 使用平台熟悉的顶部栏、标签页、列表箭头、返回和更多菜单。租户与组织切换属于上下文操作，必须与普通功能入口视觉区分。

## Do's and Don'ts

### Do:

- **Do** 使用 4px 间距网格、16px 页面边距、24px 区块间距和至少 44×44px 的触控目标。
- **Do** 在亮色与暗色主题下分别验证正文、占位文字、状态文字和禁用文字的对比度。
- **Do** 为每个异步动作提供加载、成功、失败和可重试状态，并保持布局稳定。
- **Do** 让租户、组织、身份、权限和流程状态在相关任务页面持续可见。
- **Do** 优先复用 `mx-*` 组件和语义令牌，将跨业务可复用模式沉淀到 Mx UI。

### Don't:

- **Don't** 做成老式政府门户：禁止密集栏目、横幅堆叠、厚重边框和过时拟物效果。
- **Don't** 做成通用低质小程序 UI：禁止模板化九宫格、随意圆角和无差别卡片。
- **Don't** 使用装饰性卡片网格与营销式构图，业务页面不是落地页或功能宣传页。
- **Don't** 制作单一红色界面；政务红不能覆盖大多数表面，也不能替代全部语义色。
- **Don't** 使用紫色渐变、玻璃拟态、超大 Hero、渐变文字或纯氛围装饰。
- **Don't** 使用重新发明的陌生控件，或让侧边粗色条承担卡片、列表和警告的装饰。
- **Don't** 用颜色或动画作为唯一状态表达，也不要让长文字溢出按钮、标签和卡片。
