# typescript-storm-long-text-append-flicker-demo

## 简介

与 Ink 闪屏 demo 同场景，用 **@orchetron/storm**（cell 级 diff）跑：120 行静态前缀 + 120 行末行每秒 append「字」。默认 alt screen。

**滚动说明**：Storm 走 alt screen，**不支持终端原生 scrollback 滚动**（鼠标滚轮不会滚终端历史）。长内容需用 Storm 自带 **`ScrollView`**（本 demo 已包一层）；也可 `render(..., { autoScroll: true })`。`ScrollView` 支持滚动条、滚轮、PgUp/PgDn、Shift+↑↓。

## 快速开始

需要 **Node.js 20+**。

```bash
pnpm install
pnpm start
```

按 `q` 退出。

## 对照

- 静态区：`[static …]`
- 会变区：`[grow …]`
