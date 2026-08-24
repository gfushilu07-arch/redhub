# RedHub Mx UI

RedHub 移动端框架基于 [Cool Unix](https://github.com/cool-team-official/cool-unix) 二次开发，遵循原项目 MIT 协议。公共组件前缀统一为 `mx-`，运行时别名统一为 `@/.mx`，内部类型统一为 `Mx*`。

## 当前能力

- App 级 uni-app x 组件体系，覆盖基础、表单、列表、反馈、布局和平台能力。
- 政务红设计令牌：`#C41E3A` 主色、中性表面色、亮暗双主题。
- DCloud 官方 AI Rules 与 `uni-app-x-mcp` 项目级配置。
- 登录页、产品化首页、我的页和组件演示区骨架。
- 上游构建插件保留在 `@cool-vue/unix`，通过 `build/unix.ts` 适配为 `mx()` 并重写运行时路径。
- `.cool` 仅保留四个重导出文件，兼容 HBuilderX 内置发现逻辑；业务代码必须使用 `@/.mx`。

## 开发

```bash
pnpm install
```

使用 HBuilderX 打开 `mobile/` 目录后运行到微信小程序、H5 或 App。Codex 会读取 `mobile/AGENTS.md` 和 `mobile/.codex/config.toml`，MCP 会自动提供当前项目的 easycom 组件清单。

本机验证命令：

```bash
/Applications/HBuilderX.app/Contents/MacOS/cli launch web --project "$PWD/mobile" --compile true --ui false
/Applications/HBuilderX.app/Contents/MacOS/cli launch mp-weixin --project "$PWD/mobile" --compile true --ui false
```

## 升级约定

上游 Cool Unix 仅作为构建与参考依赖。新增 UI 能力优先进入 `uni_modules/mx-ui`；跨页面状态、请求和工具能力进入 `.mx`。不要把业务页面写进 UI 模块。
