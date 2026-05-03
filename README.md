# 校园互助平台 (Campus Mutual Aid Platform)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![uni-app](https://img.shields.io/badge/uni--app-v3.0-green.svg)](https://uniapp.dcloud.io/)
[![Vue 3](https://img.shields.io/badge/Vue-3.x-brightgreen.svg)](https://vuejs.org/)
[![WeChat Mini Program](https://img.shields.io/badge/Platform-WeChat_Mini_Program-07C160.svg)](https://developers.weixin.qq.com/miniprogram/dev/framework/)

> 一个基于微信小程序的校园点对点互助服务平台，为高校学生提供便捷的跑腿代办、信息发布、社区互动等服务。

---

## 目录

- [项目简介](#项目简介)
- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [环境准备](#环境准备)
- [安装指南](#安装指南)
- [开发指南](#开发指南)
- [配置说明](#配置说明)
- [构建与部署](#构建与部署)
- [使用示例](#使用示例)
- [API 文档](#api-文档)
- [贡献指南](#贡献指南)
- [代码规范](#代码规范)
- [许可证](#许可证)
- [联系方式](#联系方式)
- [常见问题](#常见问题)

---

## 项目简介

校园互助平台是一个专为高校学生设计的微信小程序应用，旨在连接校园内的需求发布者和服务提供者。平台涵盖以下核心场景：

- **跑腿代办**：代取快递、代买物品、文件打印等
- **宿舍夜宵**：夜间零食配送服务
- **校园社区**：信息发布、话题讨论、经验分享
- **钱包系统**：佣金结算、余额提现

---

## 功能特性

### 互助跑腿
- [x] 多类别需求发布（跑腿代办、打印服务、宿舍夜宵）
- [x] 订单浏览与筛选
- [x] 在线接单与状态追踪
- [x] 佣金支付与结算
- [x] 骑手认证系统

### 帖子社区
- [x] 帖子发布与编辑
- [x] 帖子浏览与搜索
- [x] 评论与互动
- [x] 收藏与关注
- [x] 热门帖子排行

### 钱包与支付
- [x] 余额查询
- [x] 提现申请（每日限额 3 次）
- [x] 交易记录查看
- [x] 佣金自动结算

### 用户管理
- [x] 微信一键登录
- [x] 校园身份认证
- [x] 实名认证
- [x] 个人资料管理

### 客服与支持
- [x] 在线客服聊天
- [x] 帮助中心
- [x] 封禁申诉
- [x] 建议反馈

---

## 技术栈

### 核心框架
| 技术 | 版本 | 用途 |
|------|------|------|
| [uni-app](https://uniapp.dcloud.io/) | v3.0+ | 跨平台开发框架 |
| [Vue 3](https://vuejs.org/) | Composition API | 前端框架 |
| [Pinia](https://pinia.vuejs.org/) | - | 状态管理 |

### UI 与样式
| 技术 | 用途 |
|------|------|
| uni-ui | 基础组件库 |
| uni-icons | 图标组件 |
| SCSS | CSS 预处理器 |

### 开发工具
| 工具 | 用途 |
|------|------|
| ESLint | 代码规范检查 |
| Prettier | 代码格式化 |
| 微信开发者工具 | 小程序调试 |

---

## 项目结构

```
campus-wexcx/
├── pages/                    # 主包页面（6 个核心页面）
├── pagesSub/                 # 分包页面（按功能模块划分）
│   ├── mutual/               # 互助模块（详情、发布、支付、认证）
│   ├── post/                 # 帖子模块（编辑器、详情）
│   ├── profile/              # 个人中心模块（钱包、帖子、设置等）
│   └── common/               # 公共模块（搜索、热榜）
├── components/               # 公共可复用组件
├── stores/                   # Pinia 状态管理模块
├── services/                 # API 服务层
├── utils/                    # 工具函数
├── mock/                     # Mock 数据
├── static/                   # 静态资源
├── uni_modules/              # uni-app 插件
├── config.js                 # 全局配置
├── pages.json                # 页面路由配置
├── manifest.json             # 应用配置
├── App.vue                   # 应用入口
└── package.json              # 依赖配置
```

---

## 环境准备

在开始之前，请确保您的开发环境满足以下要求：

### 必需软件

| 软件 | 最低版本 | 推荐版本 | 用途 |
|------|----------|----------|------|
| [Node.js](https://nodejs.org/) | 16.0 | 18.x LTS | JavaScript 运行时 |
| [npm](https://www.npmjs.com/) | 8.0 | 9.x | 包管理器 |
| [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html) | 最新版 | 最新版 | 小程序调试 |
| [HBuilderX](https://www.dcloud.io/hbuilderx.html)（可选） | 最新版 | 最新版 | uni-app IDE |

### 验证环境

```bash
# 检查 Node.js 版本
node -v
# 应显示 v16.0.0 或更高

# 检查 npm 版本
npm -v
# 应显示 8.0.0 或更高
```

---

## 安装指南

### 1. 克隆项目

```bash
git clone https://github.com/your-username/campus-wexcx.git
cd campus-wexcx/campus-wexcx
```

### 2. 安装依赖

```bash
npm install
```

### 3. 配置项目

复制配置文件并修改必要配置：

```bash
# 编辑配置文件
# 打开 config.js，根据需要修改以下配置：
```

```javascript
// config.js
export const USE_MOCK = true              // 开发模式使用 Mock 数据
export const API_BASE_URL = 'https://api.example.com'  // 后端 API 地址
export const APP_NAME = '校园互助平台'    // 应用名称
```

### 4. 启动开发服务器

```bash
# 启动微信小程序开发模式
npm run dev:mp-weixin
```

### 5. 在微信开发者工具中运行

1. 打开微信开发者工具
2. 选择「导入项目」
3. 项目目录选择 `campus-wexcx/campus-wexcx/dist/dev/mp-weixin`
4. AppID 填写您的微信小程序 AppID（或使用测试号）
5. 点击「导入」

---

## 开发指南

### 常用命令

```bash
# 开发模式
npm run dev:mp-weixin          # 启动微信小程序开发服务器

# 构建
npm run build:mp-weixin        # 构建微信小程序（开发环境）
npm run build:prod             # 构建微信小程序（生产环境，启用压缩）

# 代码质量
npm run lint                   # 检查代码规范
npm run lint:fix               # 检查并自动修复代码规范
npm run format                 # 格式化代码
npm run format:check           # 检查代码格式
```

### 添加新页面

1. 在 `pages.json` 中注册页面：

```json
{
  "subPackages": [
    {
      "root": "pagesSub/yourModule",
      "pages": [
        {
          "path": "your-page/your-page",
          "style": {
            "navigationBarTitleText": "页面标题"
          }
        }
      ]
    }
  ]
}
```

2. 创建页面文件：

```vue
<!-- pagesSub/yourModule/your-page/your-page.vue -->
<template>
  <view class="page">
    <!-- 页面内容 -->
  </view>
</template>

<script setup>
import { ref } from 'vue'
// 页面逻辑
</script>

<style lang="scss" scoped>
.page {
  /* 页面样式 */
}
</style>
```

### 添加新服务

1. 在 `services/` 目录下创建服务文件：

```javascript
// services/your-service.js
import { USE_MOCK } from '@/config'
import { post, get } from '@/utils/request'

export const yourService = {
  async getData(params) {
    if (USE_MOCK) {
      await delay(300)
      return { success: true, data: [] }
    }
    return get('/api/your-endpoint', params)
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
```

2. 在 `services/index.js` 中导出：

```javascript
export { yourService } from './your-service'
```

### 添加新 Store

1. 在 `stores/` 目录下创建 store 文件：

```javascript
// stores/your-store.js
import { defineStore } from 'pinia'

export const useYourStore = defineStore('your', {
  state: () => ({
    data: [],
    loading: false
  }),
  actions: {
    async fetchData() {
      this.loading = true
      try {
        // 获取数据
      } finally {
        this.loading = false
      }
    }
  }
})
```

2. 在 `stores/index.js` 中导出：

```javascript
export { useYourStore } from './your-store'
```

---

## 配置说明

### config.js

| 配置项 | 类型 | 默认值 | 说明 |
|--------|------|--------|------|
| USE_MOCK | Boolean | true | 是否使用 Mock 数据 |
| API_BASE_URL | String | 'https://api.example.com' | 后端 API 地址 |
| APP_NAME | String | '校园互助平台' | 应用名称 |
| PLATFORM_FEE_RATE | Number | 0.1 | 平台抽成比例（10%） |
| MIN_COMMISSION | Number | 1 | 最低佣金（元） |
| MIN_WITHDRAW | Number | 1 | 最低提现金额（元） |
| MAX_WITHDRAW_PER_DAY | Number | 3 | 每日最大提现次数 |

### 切换到真实 API

当后端服务就绪后，修改 `config.js`：

```javascript
export const USE_MOCK = false  // 关闭 Mock 模式
export const API_BASE_URL = 'https://your-api-domain.com'  // 替换为真实 API 地址
```

---

## 构建与部署

### 开发环境构建

```bash
npm run build:mp-weixin
```

构建产物位于 `dist/dev/mp-weixin` 目录。

### 生产环境构建

```bash
npm run build:prod
```

构建产物位于 `dist/build/mp-weixin` 目录，已启用代码压缩和优化。

### 微信开发者工具上传

1. 使用微信开发者工具打开构建产物目录
2. 点击右上角「上传」按钮
3. 填写版本号和项目备注
4. 点击「上传」提交到微信公众平台

### CI/CD 建议

```yaml
# .github/workflows/deploy.yml (示例)
name: Deploy Mini Program
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: cd campus-wexcx && npm install
      - run: cd campus-wexcx && npm run build:prod
```

---

## 使用示例

### 发布互助需求

```
1. 点击底部「互助」Tab
2. 点击「发布需求」按钮
3. 选择服务类别（跑腿代办/打印/宿舍夜宵）
4. 填写需求详情和佣金金额
5. 确认发布
```

### 接单流程

```
1. 浏览互助广场的待接订单
2. 点击感兴趣的订单查看详情
3. 点击「接单」按钮
4. 完成服务后标记为已完成
5. 获得佣金结算
```

### 发布帖子

```
1. 点击底部「帖子」Tab
2. 点击「发布」按钮
3. 编辑帖子内容
4. 点击「发布」
```

---

## API 文档

### 端点列表

当前项目使用 Mock 数据，以下为 API 端点规划：

#### 用户相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/auth/login | 微信登录 | 否 |
| GET | /api/user/profile | 获取用户资料 | 是 |
| PUT | /api/user/profile | 更新用户资料 | 是 |
| POST | /api/user/campus-auth | 校园认证 | 是 |
| POST | /api/user/realname-auth | 实名认证 | 是 |

#### 订单相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/orders | 获取订单列表 | 是 |
| POST | /api/orders | 创建订单 | 是 |
| GET | /api/orders/:id | 获取订单详情 | 是 |
| POST | /api/orders/:id/accept | 接受订单 | 是 |
| POST | /api/orders/:id/complete | 完成订单 | 是 |

#### 帖子相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/posts | 获取帖子列表 | 否 |
| POST | /api/posts | 创建帖子 | 是 |
| GET | /api/posts/:id | 获取帖子详情 | 否 |
| POST | /api/posts/:id/like | 点赞帖子 | 是 |
| POST | /api/posts/:id/update | 更新帖子 | 是 |
| POST | /api/posts/:id/delete | 删除帖子 | 是 |

#### 评论相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/comments/user | 获取用户评论 | 是 |
| POST | /api/comments/:id/delete | 删除评论 | 是 |

#### 钱包相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| GET | /api/wallet/balance | 获取余额 | 是 |
| POST | /api/wallet/withdraw | 提现申请 | 是 |
| GET | /api/wallet/transactions | 交易记录 | 是 |

#### 支付相关

| 方法 | 端点 | 说明 | 认证 |
|------|------|------|------|
| POST | /api/payment/create | 创建支付订单 | 是 |
| POST | /api/payment/callback | 支付回调 | 否 |

### 请求格式

```javascript
// 成功响应
{
  "code": 0,
  "data": { /* 数据内容 */ },
  "message": "success"
}

// 错误响应
{
  "code": 401,
  "message": "登录已过期"
}
```

### 认证方式

所有需要认证的接口需要在请求头中携带 Token：

```
Authorization: Bearer <your-token>
```

---

## 贡献指南

我们欢迎所有形式的贡献！请按照以下步骤参与项目开发：

### 1. Fork 项目

在 GitHub 上点击「Fork」按钮创建项目副本。

### 2. 克隆到本地

```bash
git clone https://github.com/your-username/campus-wexcx.git
cd campus-wexcx
```

### 3. 创建分支

```bash
git checkout -b feature/your-feature-name
# 或
git checkout -b fix/your-bug-fix
```

### 4. 开发并测试

- 遵循项目的代码风格和规范
- 编写清晰的提交信息
- 确保代码通过 lint 检查

### 5. 提交 Pull Request

1. 将修改推送到您的 Fork
2. 在 GitHub 上创建 Pull Request
3. 清晰描述您的修改内容和目的
4. 等待代码审查

### Pull Request 规范

提交 PR 时，请包含以下信息：

```markdown
## 修改类型
- [ ] 新功能
- [ ] Bug 修复
- [ ] 文档更新
- [ ] 代码优化

## 修改描述
简要说明本次修改的内容和目的。

## 测试
- 是否已测试相关功能？
- 是否影响现有功能？

## 截图（如有）
添加相关截图以展示修改效果。
```

---

## 代码规范

### ESLint 配置

项目使用 ESLint 进行代码规范检查，配置文件为 `.eslintrc.js`：

```bash
# 检查代码
npm run lint

# 自动修复
npm run lint:fix
```

### Prettier 配置

项目使用 Prettier 进行代码格式化：

```bash
# 格式化代码
npm run format

# 检查格式
npm run format:check
```

### Vue 组件规范

- 使用 `<script setup>` 语法
- 使用 SCSS 进行样式编写
- 组件命名使用 kebab-case
- Props 需要定义类型和默认值

### 命名规范

| 类型 | 规范 | 示例 |
|------|------|------|
| 组件名 | kebab-case | `order-card.vue` |
| 变量/函数 | camelCase | `getUserInfo()` |
| 常量 | UPPER_SNAKE_CASE | `API_BASE_URL` |
| CSS 类名 | kebab-case | `.post-item` |
| Pinia Store | camelCase | `useUserStore` |

---

## 许可证

本项目采用 MIT 许可证。详情请参阅 [LICENSE](LICENSE) 文件。

```
MIT License

Copyright (c) 2026 Campus Mutual Aid Platform

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 联系方式

### 项目维护者

| 角色 | 联系方式 |
|------|----------|
| 项目负责人 | 请通过 GitHub Issues 联系 |
| 技术支持 | 请通过 GitHub Issues 联系 |

### 反馈与支持

- **Bug 报告**：[GitHub Issues](https://github.com/your-username/campus-wexcx/issues)
- **功能建议**：[GitHub Discussions](https://github.com/your-username/campus-wexcx/discussions)
- **邮件联系**：（待补充）

---

## 常见问题

### Q: 如何切换到真实 API？

A: 修改 `config.js` 中的 `USE_MOCK` 为 `false`，并设置正确的 `API_BASE_URL`。

### Q: 微信开发者工具无法显示页面？

A: 确保已运行 `npm run dev:mp-weixin`，并正确导入了 `dist/dev/mp-weixin` 目录。

### Q: 图标显示不正常？

A: 检查使用的图标名称是否在 uni-icons 支持的范围内。可参考 [uni-icons 文档](https://uniapp.dcloud.io/component/uniui/uni-icons)。

### Q: 如何添加新的 TabBar 图标？

A: 在 `static/tabbar/` 目录下放置图标文件，并在 `pages.json` 的 `tabBar.list` 中配置。

### Q: 编译报错找不到模块？

A: 运行 `npm install` 确保依赖已正确安装。如仍有问题，尝试删除 `node_modules` 后重新安装。

### Q: 页面跳转路径错误？

A: 分包页面路径需以 `/pagesSub/` 开头，例如 `/pagesSub/mutual/detail/detail`。

---

*如果这个项目对您有帮助，请给我们一个 Star！*
