# GitMirror — Git 镜像站管理平台

<div align="center">
  <img src="./public/vercel.svg" alt="GitMirror" width="60" />
  <br/><br/>

  **统一管理企业 Git 镜像仓库的一站式后台系统**

  [![Next.js](https://img.shields.io/badge/Next.js-16.2-000000?style=flat-square&logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat-square&logo=react)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
  [![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

  **简体中文** · [API 文档](#api-接口) · [更新日志](#更新日志)
</div>

---

## 📋 目录

- [项目概述](#-项目概述)
- [技术栈](#-技术栈)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [功能详解](#-功能详解)
  - [仪表盘](#仪表盘)
  - [镜像仓库管理](#镜像仓库管理)
  - [同步任务](#同步任务)
  - [活动日志](#活动日志)
  - [用户管理](#用户管理)
  - [系统设置](#系统设置)
  - [API 密钥管理](#api-密钥管理)
  - [公告管理](#公告管理)
  - [帮助文档](#帮助文档)
- [UI 组件体系](#-ui-组件体系)
- [数据模型](#-数据模型)
- [状态管理](#-状态管理)
- [认证与授权](#-认证与授权)
- [样式方案](#-样式方案)
- [增强功能](#-增强功能)
- [开发指南](#-开发指南)
- [更新日志](#-更新日志)
- [许可证](#-许可证)

---

## 🚀 项目概述

GitMirror 是一个面向企业级 Git 镜像站的管理平台。它提供统一的 Web 界面，用于管理上游仓库的镜像同步、监控同步状态、管理系统用户以及各项配置。

**核心价值：**
- 在本地网络提供更快的代码拉取速度
- 减少对外部网络的依赖
- 提供统一的仓库管理入口
- 实时监控同步状态和系统健康度

---

## 🛠 技术栈

| 类别 | 技术 | 版本 |
|------|------|------|
| **框架** | [Next.js](https://nextjs.org/) (App Router) | 16.2.10 |
| **UI 库** | [React](https://react.dev/) | 19.2.4 |
| **语言** | [TypeScript](https://www.typescriptlang.org/) | ^5 |
| **样式** | [Tailwind CSS](https://tailwindcss.com/) | ^4 |
| **状态管理** | React Context + useReducer | — |
| **图表** | [Recharts](https://recharts.org/) | ^3.9.2 |
| **图标** | [Lucide React](https://lucide.dev/) | ^1.24.0 |
| **工具类** | [clsx](https://github.com/lukeed/clsx) + [tailwind-merge](https://github.com/dcastil/tailwind-merge) | — |
| **样式变体** | [class-variance-authority](https://cva.style/) | ^0.7.1 |
| **日期处理** | [date-fns](https://date-fns.org/) | ^4.4.0 |
| **UI 原语** | [Radix UI](https://www.radix-ui.com/) (Select, Dialog, Toast 等) | — |
| **数据验证** | [Zod](https://zod.dev/) | ^4.4.3 |

---

## ⚡ 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装与运行

```bash
# 克隆仓库
git clone https://github.com/AnnaofArendelle/git-mirror-dashboard.git
cd git-mirror-dashboard

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 启动生产服务器
npm start

# 运行代码检查
npm run lint
```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

### 测试账号

| 角色 | 邮箱 | 密码 |
|------|------|------|
| 👑 管理员 | admin@mirror.com | admin123 |
| 🔧 操作员 | operator@mirror.com | admin123 |
| 👀 观察者 | viewer@mirror.com | admin123 |

---

## 📁 项目结构

```
git-mirror-dashboard/
├── public/                          # 静态资源
│   ├── vercel.svg
│   ├── next.svg
│   └── ...
├── src/
│   ├── app/                         # Next.js App Router 页面
│   │   ├── layout.tsx               # 根布局（AuthProvider + ToastProvider + ErrorBoundary）
│   │   ├── page.tsx                 # 仪表盘主页
│   │   ├── globals.css              # 全局样式（Tailwind + 自定义 CSS）
│   │   ├── login/                   # 登录页面
│   │   ├── repos/                   # 镜像仓库列表 & 详情
│   │   │   └── [id]/                # 仓库详情（动态路由）
│   │   ├── sync-jobs/               # 同步任务列表
│   │   ├── activity/                # 活动日志
│   │   ├── users/                   # 用户管理
│   │   ├── settings/                # 系统设置
│   │   ├── api-keys/                # API 密钥管理
│   │   ├── announcements/           # 公告管理
│   │   │   ├── new/                 # 新建公告
│   │   │   └── [id]/edit/           # 编辑公告（动态路由）
│   │   └── help/                    # 帮助文档 / FAQ
│   ├── components/
│   │   ├── layout/                  # 布局组件
│   │   │   ├── app-shell.tsx        # 应用外壳（认证守卫 + 侧边栏 + 顶部栏）
│   │   │   └── notification-panel.tsx # 通知面板（告警/公告/系统通知）
│   │   └── ui/                      # UI 组件库
│   │       ├── card.tsx             # 卡片 & Modal
│   │       ├── button.tsx           # 按钮（5 种变体 + 3 种尺寸）
│   │       ├── badge.tsx            # 徽章（6 种变体）
│   │       ├── input.tsx            # 输入框（带标签 + 错误提示）
│   │       ├── select.tsx           # 选择框（带图标装饰）
│   │       ├── stat-card.tsx        # 统计卡片（趋势指示）
│   │       ├── status-badge.tsx     # 状态 & 健康度徽章
│   │       ├── toast.tsx            # Toast 通知系统
│   │       ├── error-boundary.tsx   # 错误边界
│   │       ├── skeleton.tsx         # 骨架屏加载态
│   │       ├── markdown-renderer.tsx # Markdown 渲染器
│   │       └── global-search.tsx    # 全局搜索
│   └── lib/                         # 核心逻辑
│       ├── types.ts                 # TypeScript 类型定义
│       ├── data.ts                  # 模拟数据 & 数据查询函数
│       ├── utils.ts                 # 工具函数（格式化、颜色映射等）
│       ├── auth-context.tsx         # 认证上下文（登录/登出）
│       └── store.tsx                # 公告状态管理（useReducer）
├── .claude/                         # Claude AI 配置
├── AGENTS.md                        # AI 代理规则
├── CLAUDE.md                        # Claude 项目配置
├── next.config.ts                   # Next.js 配置
├── tsconfig.json                    # TypeScript 配置
├── tailwind.config.ts               # Tailwind CSS 配置
├── postcss.config.mjs               # PostCSS 配置
├── eslint.config.mjs                # ESLint 配置
└── package.json                     # 依赖与脚本
```

---

## 💡 功能详解

### 仪表盘

仪表盘是平台的总览入口，集中展示镜像站整体运行状态。

**核心视图：**
- **状态横幅** — 未处理告警概览，点击可查看详情或一键标记已读
- **统计卡片** — 8 个核心指标：
  - 镜像仓库总数（含正常/异常数）
  - 总存储使用量（含趋势百分比）
  - 今日同步次数 & 成功率
  - 系统运行时间（30 天）
  - 本月/今日带宽使用
  - 活跃用户数
  - 平均同步时长
- **同步趋势图** — 柱状图展示最近 7 天成功/失败同步数
- **带宽使用趋势图** — 面积图展示每日带宽（GB）
- **仓库健康度排行** — Top 5 仓库健康评分排行，点击跳转详情
- **最近同步任务** — 最近 5 条同步任务摘要
- **最近动态** — 最近 6 条系统活动记录
- **运行报告弹窗** — 一键生成的系统运行摘要，支持导出 PDF/CSV

**文件：** `src/app/page.tsx`

---

### 镜像仓库管理

统一管理所有被镜像的上游仓库。

**功能列表：**

- **搜索筛选** — 支持仓库名称/描述搜索
- **多维筛选** — 状态（正常/同步中/异常/已暂停）+ 语言 + 可见性（公开/内部/私有）
- **排序** — 按名称、健康度、Star 数、大小、更新时间排序
- **添加仓库** — 弹窗表单，指定名称、上游地址、协议、同步间隔
- **仓库卡片** — 展示名称、状态、健康度、可见性图标、描述、协议、Star/Fork/大小、同步间隔
- **语言和标签** — 语言徽章 + 自定义标签
- **空状态** — 无结果时显示友好的引导界面

**仓库详情页** (`/repos/[id]`)：
- 仓库信息网格（16 项：上游地址、镜像地址、协议、可见性等）
- 标签展示
- Webhooks 管理（查看/添加，支持多事件选择）
- 快速操作（浏览器打开、同步历史、修改同步计划）
- 同步历史表格（状态、触发方式、耗时、新提交、传输大小）
- 立即同步（模拟触发 + 进度反馈）
- 仓库配置（名称、地址、协议、可见性）
- 删除仓库（含危险确认流程）

**文件：** `src/app/repos/page.tsx`, `src/app/repos/[id]/page.tsx`

---

### 同步任务

监控所有仓库的同步作业执行情况。

**功能列表：**

- **状态筛选** — 运行中/成功/失败/等待中/已取消
- **触发方式筛选** — 定时/手动/Webhook/重试
- **任务表格** — 仓库名、状态徽章、触发方式、耗时、推送引用数、新提交数、传输大小、时间
- **操作按钮**：
  - 失败任务可**重试**（模拟 2s 后完成）
  - 运行中任务可**取消**
  - 成功/失败任务可**查看日志**
- **批量重试** — 一键重试所有失败任务
- **日志弹窗** — 终端风格日志（暗色背景 + 行号），显示错误信息
- **刷新** — 手动刷新任务列表

**文件：** `src/app/sync-jobs/page.tsx`

---

### 活动日志

记录系统所有操作和事件的时间线。

**功能列表：**

- **时间线视图** — 垂直时间线布局，每项带类型图标和颜色编码
- **类型筛选** — 同步/错误/用户操作/配置变更/系统
- **严重级别筛选** — 🔴 错误 / 🟡 警告 / 🔵 信息 / 🟢 成功
- **类型图标映射** — 🔄 同步 / ❌ 错误 / 👤 用户 / ⚙️ 配置 / 🖥️ 系统
- **详情弹窗** — 点击活动条目查看完整信息（类型、严重级别、消息、相关仓库、操作人、时间）
- **导出** — 支持导出活动日志
- **刷新** — 手动刷新

**文件：** `src/app/activity/page.tsx`

---

### 用户管理

管理系统用户账号和权限。

**功能列表：**

- **角色筛选** — 管理员/操作员/观察者
- **用户卡片** — 头像（首字母）、姓名、邮箱、角色徽章、状态
- **账号信息** — API 密钥数量、MFA 状态（✅ 已启用/❌ 未启用）、上次登录时间
- **操作按钮**：
  - 🛡️ **权限管理** — 单选切换角色，含角色描述
  - 👤 **查看资料** — 完整信息弹窗（角色、状态、API 密钥数、MFA、登录时间、创建时间）
  - ⛔ **启用/禁用** — 一键切换账户状态
- **邀请用户** — 弹窗输入邮箱 + 选择角色，模拟发送邀请
- **数据统计** — 总数 / 活跃 / 已禁用

**文件：** `src/app/users/page.tsx`

---

### 系统设置

配置镜像站的全局参数。

**功能列表：**

- **同步设置** — 默认同步间隔、最大并发数、超时时间、重试次数、重试延迟、存储配额
- **网络设置** — 代理服务器、SSH 密钥路径、通知邮箱、Webhook 密钥（显示/隐藏切换）
- **功能开关** — 自动同步 / Webhook 同步 / 通知告警（自定义 toggle 开关）
- **维护设置** — 日志保留天数、系统日志导出
- **重置设置** — 确认弹窗后恢复所有设置为默认值
- **保存反馈** — 成功 toast 提示

**文件：** `src/app/settings/page.tsx`

---

### API 密钥管理

管理用于自动化集成和第三方工具访问的 API 密钥。

**功能列表：**

- **安全提示横幅** — 密钥保管提醒
- **筛选** — 按状态（启用/已过期/已撤销）和权限级别
- **密钥卡片** — 密钥名称、状态徽章、权限徽章、密钥前缀
- **操作按钮**：
  - 👁️ **查看详情** — 完整密钥信息弹窗
  - ❌ **撤销密钥** — 危险确认流程
- **创建密钥流程**：
  1. 输入名称 + 选择权限级别
  2. 生成密钥后**仅显示一次**，引导立即复制保存
  3. 支持一键复制到剪贴板
- **复制状态** — 每个密钥独立显示"已复制"反馈
- **状态标签** — 启用（🟢）/ 已过期（🟡）/ 已撤销（🔴）

**文件：** `src/app/api-keys/page.tsx`

---

### 公告管理

发布和管理系统公告。

**功能列表：**

- **搜索** — 标题/内容搜索
- **筛选** — 按状态（已发布/草稿/归档）和优先级（高/普通/低）
- **公告卡片** — 置顶标识📌、标题、优先级徽章、状态徽章、内容摘要、作者、日期、阅读数
- **排序** — 置顶优先，新建优先
- **操作按钮**：
  - 📤 **发布**（草稿 → 已发布）
  - 📌 **置顶/取消置顶**
  - ✏️ **编辑**
  - 📦 **归档**（已发布 → 归档）
  - 🗑️ **删除**（危险确认）
- **新建/编辑公告**：
  - 标题输入
  - 优先级选择
  - 标签管理（添加/删除）
  - Markdown 内容编辑（16 行文本域）
  - **实时预览** — 使用完整 Markdown 渲染器展示效果
  - 保存草稿 / 发布 / 更新
- **公告数据** — 总数 / 已发布 / 草稿 统计

**文件：** `src/app/announcements/page.tsx`, `src/app/announcements/new/page.tsx`, `src/app/announcements/[id]/edit/page.tsx`

---

### 帮助文档

常见问题和使用指南。

**功能列表：**

- **搜索** — 问题/答案全文搜索
- **分类筛选** — 全部/入门指南/同步配置/权限管理/存储管理/故障排除
- **快速链接卡片** — API 密钥、系统设置、联系支持
- **FAQ 手风琴** — 点击展开/收起，含 Q/A 标识
- **联系支持** — 在线咨询 / 邮件发送 / 提交工单
- **空状态** — 未找到匹配内容的友好提示 + 一键清除搜索

**文件：** `src/app/help/page.tsx`

---

## 🧩 UI 组件体系

### 通用组件

| 组件 | 文件 | 功能 | Props |
|------|------|------|-------|
| `Card` | `card.tsx` | 卡片容器 | `children`, `className`, `padding` |
| `CardHeader` | `card.tsx` | 卡片标题区 | `children`, `className` |
| `CardTitle` | `card.tsx` | 卡片标题 | `children`, `className` |
| `CardContent` | `card.tsx` | 卡片内容区 | `children`, `className` |
| `Modal` | `card.tsx` | 弹窗（ESC 关闭 + 背景锁定 + ARIA） | `open`, `onClose`, `title`, `children` |
| `Button` | `button.tsx` | 按钮（forwardRef） | `variant` (primary/secondary/ghost/danger/outline), `size` (sm/md/lg), `loading` |
| `Badge` | `badge.tsx` | 徽章 | `variant` (default/success/warning/error/info/outline), `size` (sm/md) |
| `Input` | `input.tsx` | 输入框（带标签 + 错误提示） | `label`, `error`, `id`, + HTMLInput |
| `Select` | `select.tsx` | 选择框（自定义图标装饰） | `label`, `options`, `value`, `onChange` |
| `StatCard` | `stat-card.tsx` | 统计卡片（趋势指示） | `title`, `value`, `icon`, `description`, `trend` |
| `StatusBadge` | `status-badge.tsx` | 状态徽章（带颜色圆点） | `status` |
| `HealthBadge` | `status-badge.tsx` | 健康度徽章 | `score` (0-100) |

### 增强组件

| 组件 | 文件 | 功能 | Props |
|------|------|------|-------|
| `ToastProvider` | `toast.tsx` | Toast 上下文提供者 | `children` |
| `useToast` | `toast.tsx` | Toast Hook | 返回 `{ toast }` |
| `ErrorBoundary` | `error-boundary.tsx` | 错误边界（含重试按钮） | `children`, `fallback?` |
| `GlobalSearch` | `global-search.tsx` | ⌘K 全局搜索弹窗 | — |
| `MarkdownRenderer` | `markdown-renderer.tsx` | Markdown 渲染器 | `content` |
| `Skeleton` | `skeleton.tsx` | 骨架屏占位 | `className` |
| `StatCardSkeleton` | `skeleton.tsx` | 统计卡片骨架屏 | — |
| `CardSkeleton` | `skeleton.tsx` | 卡片骨架屏 | `height?` |
| `DashboardSkeleton` | `skeleton.tsx` | 仪表盘完整骨架屏 | — |

### 布局组件

| 组件 | 文件 | 功能 |
|------|------|------|
| `AppShell` | `app-shell.tsx` | 应用外壳：未登录→登录页，已登录→侧边栏+顶部栏+内容区，加载中→旋转动画 |
| `Sidebar` | `sidebar.tsx` | 侧边栏导航（可折叠，6 主菜单 + 3 副菜单，未读通知数） |
| `Header` | `header.tsx` | 顶部栏（全局搜索框、暗色模式切换、通知图标+未读数、用户菜单） |
| `NotificationPanel` | `notification-panel.tsx` | 通知下拉面板（全部/告警/公告/系统 四标签，置顶公告区，标已读操作） |

---

## 📐 数据模型

核心 TypeScript 类型定义位于 `src/lib/types.ts`：

### 镜像仓库 (`MirrorRepo`)
| 字段 | 类型 | 说明 |
|------|------|------|
| `id` | `string` | 唯一标识 |
| `name` | `string` | 仓库名称 |
| `description` | `string` | 描述 |
| `upstreamUrl` | `string` | 上游地址 |
| `mirrorUrl` | `string` | 镜像地址 |
| `protocol` | `'https' \| 'ssh' \| 'git'` | 协议 |
| `status` | `'active' \| 'syncing' \| 'error' \| 'paused' \| 'inactive'` | 同步状态 |
| `visibility` | `'public' \| 'internal' \| 'private'` | 可见性 |
| `language` | `string` | 编程语言 |
| `healthScore` | `number` | 健康度 (0-100) |
| ... | ... | (完整 22 字段) |

### 同步任务 (`SyncJob`)
| 字段 | 类型 | 说明 |
|------|------|------|
| `status` | `SyncJobStatus` | pending / running / success / failed / cancelled |
| `trigger` | `SyncJobTrigger` | scheduled / manual / webhook / retry |
| `refsPushed` | `number` | 推送引用数 |
| `newCommits` | `number` | 新增提交数 |
| `errorMessage` | `string \| null` | 错误信息 |
| `logs` | `string[]` | 同步日志 |

### 用户 (`User`)
| 字段 | 类型 | 说明 |
|------|------|------|
| `role` | `UserRole` | admin / operator / viewer |
| `status` | `'active' \| 'disabled'` | 账号状态 |
| `mfaEnabled` | `boolean` | 多因素认证 |
| `apiKeys` | `number` | API 密钥数 |

### 其他类型
- `SystemStats` — 系统统计（12 项指标）
- `SyncChartPoint` — 图表数据点
- `Activity` — 活动日志（含类型/严重级别）
- `Alert` — 告警/通知（含类别/已读状态）
- `Announcement` — 公告（含优先级/状态/置顶）
- `GlobalSettings` — 全局配置（15 项参数）
- `Webhook` — Webhook 配置
- `ApiResponse<T>` — 通用 API 响应包装
- `PaginationMeta` — 分页元数据

---

## 🔄 状态管理

项目采用轻量级的 **React Context + useReducer** 模式：

```
AuthProvider          → 认证状态 (user, login, logout, loginError)
AnnouncementProvider  → 公告 CRUD (ADD / UPDATE / DELETE / TOGGLE_PIN / ARCHIVE / PUBLISH)
ToastProvider         → Toast 通知系统 (success / error / warning / info)
```

**认证上下文** (`auth-context.tsx`)：
- 模拟登录（800ms 延迟）
- 三个预设账号（管理员/操作员/观察者）
- 登录错误提示

**公告 Store** (`store.tsx`)：
- 基于 `useReducer` 的声明式状态管理
- 支持 6 种 action 类型
- 提供 `useAnnouncements()` 和 `useAnnouncement(id)` hook

---

## 🔐 认证与授权

### 认证流程

```
未登录 → 访问任意页面 → AppShell 检测 → 重定向 /login
登录成功 → 存储用户信息 → 跳转仪表盘
退出登录 → 清除用户信息 → 确认弹窗 → 返回登录页
```

### 路由守卫

`AppShell` 组件 (`src/components/layout/app-shell.tsx`) 作为路由守卫：
1. 检测当前路径是否为 `/login`
2. 未认证且不在登录页 → 重定向到 `/login`
3. 未认证且正在跳转 → 显示加载动画
4. 已认证 → 渲染侧边栏 + 顶部栏 + 内容区

### 角色权限

| 角色 | 权限描述 |
|------|----------|
| 👑 **管理员** (admin) | 完全访问权限，包括系统设置和用户管理 |
| 🔧 **操作员** (operator) | 仓库管理和同步操作，无法修改系统设置 |
| 👀 **观察者** (viewer) | 只读权限，只能查看状态和记录 |

API 密钥同样遵循三级权限体系。

---

## 🎨 样式方案

### Tailwind CSS 4

采用 Tailwind CSS 4 的最新特性：
- `@import "tailwindcss"` 导入方式
- `@custom-variant dark` 自定义暗色变体
- OKLCH 色彩空间（更精准的颜色表现）
- `tailwindcss-animate` 动画插件

### 暗色模式

- 基于 `.dark` CSS 类切换
- 所有组件均支持 light/dark 双主题
- 通过 Header 右上角的 🌙/☀️ 按钮切换
- 全局暗色变量定义在 `globals.css`

### 自定义滚动条

```css
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
```

明暗主题下分别使用对应的颜色，圆角设计，悬浮高亮。

### 颜色系统

基于 Zinc 中性色系 + 语义化色彩：
- **状态颜色**：emerald（成功 ✅）、blue（进行中 🔄）、red（错误 ❌）、amber（警告 ⚠️）
- **语义映射**：`getStatusColor()` / `getStatusBg()` / `getHealthColor()` 等工具函数实现统一映射

---

## ✨ 增强功能

### ⌘K 全局搜索 (`global-search.tsx`)

- **快捷键**：`Cmd/Ctrl + K` 打开/关闭
- **实时搜索**：输入即搜索仓库/用户/同步任务
- **分组展示**：按类型分组，每项含图标 + 标题 + 副标题
- **键盘导航**：↑↓ 选择 / Enter 跳转 / Esc 关闭
- **快捷键提示**：搜索框内显示 ⌘K 标签
- **空状态**：无输入时引导提示，无结果时友好反馈
- **搜索范围**：仓库名/描述/语言、用户名/邮箱、同步任务仓库名

### 🍞 Toast 通知系统 (`toast.tsx`)

- **上下文驱动**：`ToastProvider` 根组件注入，`useToast()` 任意组件调用
- **四种类型**：success / error / warning / info，各自配色和图标
- **自动消失**：默认 4s 后自动关闭
- **手动关闭**：每条 Toast 右上角 X 按钮
- **多层支持**：支持同时显示多条 Toast
- **入场动画**：`slide-in-from-right` 滑入效果
- **无障碍**：`aria-live="polite"` 实时区域

### 🛡️ 错误边界 (`error-boundary.tsx`)

- **类组件实现**：`getDerivedStateFromError` + `componentDidCatch`
- **友好界面**：错误图标 + 错误消息 + 重试按钮
- **自定义后备 UI**：支持传入 `fallback` prop
- **全局应用**：根布局中包裹 `AppShell`

### 📝 Markdown 渲染器 (`markdown-renderer.tsx`)

- **标题**：`##` (h2) / `###` (h3)
- **内联格式**：**粗体** (`**text**`)、*斜体* (`*text*`)、`行内代码` (`` `code` ``)
- **链接**：`[text](url)`（自动新窗口打开）
- **列表**：无序列表 (`-` / `*` / `+`)、有序列表 (`1.`)
- **引用**：`> blockquote`
- **代码块**：```` ``` ```` 包裹（暗色终端风格背景）
- **分隔线**：`---`
- **安全渲染**：避免 dangerouslySetInnerHTML

### 💀 骨架屏 (`skeleton.tsx`)

- **基础组件**：`Skeleton` 通用占位块
- **组合组件**：`StatCardSkeleton`、`CardSkeleton`、`TableRowSkeleton`
- **页面级**：`DashboardSkeleton` 一键为仪表盘生成完整加载态

---

## 🔧 开发指南

### 添加新页面

```typescript
// src/app/example/page.tsx
'use client';

export default function ExamplePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">示例页面</h1>
    </div>
  );
}
```

### 添加动态路由

```typescript
// src/app/items/[id]/page.tsx
import { use } from 'react';

export default function ItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  return <div>Item: {id}</div>;
}
```

### 使用 Toast 通知

```typescript
import { useToast } from '@/components/ui/toast';

function MyComponent() {
  const { toast } = useToast();

  return (
    <Button onClick={() => toast({
      type: 'success',
      title: '操作成功',
      message: '数据已保存',
    })}>
      保存
    </Button>
  );
}
```

### 使用全局搜索快捷键

```typescript
// 在任何页面中按下 Cmd/Ctrl+K 即可呼出搜索
// GlobalSearch 已在 Header 中引入，无需额外配置
```

### 添加数据模拟

```typescript
// src/lib/data.ts
import type { YourType } from './types';

export const mockData: YourType[] = [
  // ...模拟数据
];

export function getDataById(id: string) {
  return mockData.find(item => item.id === id);
}
```

---

## 📦 依赖一览

| 依赖 | 用途 |
|------|------|
| `next` | 框架核心 |
| `react` / `react-dom` | UI 库 |
| `typescript` | 类型检查 |
| `tailwindcss` | 样式框架 |
| `recharts` | 图表绘制 |
| `lucide-react` | 图标库 |
| `date-fns` | 日期处理 |
| `zod` | 数据验证 |
| `clsx` / `tailwind-merge` | 类名合并 |
| `class-variance-authority` | 样式变体 |
| `@radix-ui/*` | 无障碍 UI 原语 |

---

## 📄 更新日志

### v0.1.0 (2026-07)

- 初始化项目骨架，基于 Next.js 16 App Router
- 实现 13 个功能页面 + 登录和认证系统
- 构建完整的 UI 组件库（卡片、按钮、输入框、选择框、徽章等）
- 仪表盘集成 Recharts 图表展示同步趋势
- 公告系统支持 Markdown 编辑/预览/发布/归档/置顶
- 用户管理系统支持角色切换/启用禁用
- 全局搜索 (⌘K) 支持仓库/用户/同步任务多维搜索
- Toast 通知系统支持四种类型和自动消失
- 错误边界防止局部崩溃导致白屏
- Markdown 渲染器支持完整语法（粗体、代码块、引用、链接等）
- 骨架屏组件提升加载体验
- 暗色模式支持
- ESLint 配置

---

## 📄 许可证

本项目基于 MIT 许可证开源。

---

<div align="center">
  <sub>Built with ❤️ by the GitMirror Team</sub>
  <br/>
  <sub>文档最后更新: 2026-07-17</sub>
</div>
