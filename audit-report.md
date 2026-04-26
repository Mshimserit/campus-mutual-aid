# 校园互助平台 - 全面代码审计报告

## 项目概述

**项目类型**：uni-app 微信小程序（Vue 3 + `<script setup>`）  
**核心功能**：校园互助跑腿订单、帖子发布/浏览、消息通知、个人中心、钱包提现  
**技术栈**：uni-app + Vue 3 + Pinia（模拟）+ uni-ui + 本地 Mock 数据

---

## 项目结构

```
pages/                  # 26 个页面
  index/index          # 首页
  hot/hot              # 热榜
  mutual/list/list     # 互助订单列表
  mutual/detail/detail # 订单详情
  mutual/publish/publish # 发布需求
  mutual/payment/payment # 支付佣金
  mutual/auth/auth     # 骑手认证
  post/post            # 发布帖子
  post/detail/detail   # 帖子详情
  message/message      # 消息中心
  search/search        # 搜索
  profile/index/index  # TabBar"我的"页
  profile/center/center # 个人中心
  profile/edit/edit    # 编辑资料
  profile/wallet/wallet # 钱包
  profile/wallet/withdraw # 提现
  profile/my-posts/    # 我的帖子（仅 pages.json 注册，文件可能缺失）
  profile/my-comments/ # 历史评论
  profile/my-watch/    # 我的蹲贴
  profile/my-favorites/# 我的收藏
  profile/service/*    # 客服/申诉/反馈（4个）
  profile/settings/*   # 商务合作/开通圈子/用户协议/隐私政策（4个）

services/              # 6 个服务层文件
stores/                # 4 个状态管理文件
mock/                  # 5 个 Mock 数据文件
utils/                 # 4 个工具函数
```

---

## 问题清单

### 一、【严重】安全与隐私问题

#### 1.1 敏感信息泄露风险
- **位置**：[detail.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/detail/detail.vue)
- **问题**：发单人的电话号码 `order.phone` 在 Mock 数据中为 `'187****8429'`，但如果后端返回真实手机号，非接单人和非发单人仍可能通过其他方式获取
- **修复方案**：
  - 后端应在返回订单数据时对非相关用户的手机号进行脱敏处理
  - 前端增加 `isPublisher` 和 `isAcceptor` 的双重校验

#### 1.2 无登录态校验
- **位置**：全局
- **问题**：所有页面都没有检查 `userStore.isLoggedIn`，未登录用户也能直接访问发布、接单、支付等核心功能
- **修复方案**：在 `publish.vue`、`list.vue`、`payment.vue` 等关键页面添加登录态校验，未登录跳转登录页

#### 1.3 `manifest.json` 中 `urlCheck: false`
- **位置**：[manifest.json](file:///d:/campus-wexcx/campus-wexcx/manifest.json):48
- **问题**：关闭了 URL 合法域名校验，可能导致请求被劫持到恶意域名
- **修复方案**：上线前必须设置为 `true`，并确保所有 API 域名在微信后台配置

### 二、【严重】数据一致性问题

#### 2.1 订单创建流程断裂
- **位置**：[publish.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/publish/publish.vue) → [payment.vue](file:///d:/campus-wexcx/campus-wexcx/campus-wexcx/pages/mutual/payment/payment.vue)
- **问题**：
  - `publish.vue` 调用 `orderService.createOrder()` 创建订单，订单状态为 `PENDING`
  - 然后跳转到 `payment.vue` 进行支付
  - `payment.vue` 支付成功后**再次调用** `orderStore.addOrder()` 创建一个**新订单**，而不是更新已有订单
  - 导致同一订单被创建两次，状态混乱
- **修复方案**：支付页面应通过 `orderId` 查询已有订单并更新其状态为 `PAID`，而不是创建新订单

#### 2.2 Store 与 Service 数据源不一致
- **位置**：[order-store.js](file:///d:/campus-wexcx/campus-wexcx/stores/order-store.js)、[order-service.js](file:///d:/campus-wexcx/campus-wexcx/services/order-service.js)
- **问题**：
  - `order-store.js` 初始化时加载 `mockOrders`
  - `order-service.js` 的 `createOrder` 会同时向 `useOrderStore().addOrder()` 添加数据
  - 但是 `getOrders` 返回的是 `[...mockOrders]`（原始 Mock 数据），不会返回 store 中新增的订单
  - 导致发布新订单后，在订单列表中看不到刚创建的订单
- **修复方案**：`getOrders` 应返回 `orderStore.state.orders` 而不是原始 `mockOrders`

#### 2.3 Wallet 余额更新不同步
- **位置**：[wallet-service.js](file:///d:/campus-wexcx/campus-wexcx/services/wallet-service.js)、[wallet-store.js](file:///d:/campus-wexcx/campus-wexcx/stores/wallet-store.js)
- **问题**：`walletService.withdraw()` 调用 `wallet.updateBalance(-amount)`，但 `wallet-store.js` 的 `withdraw()` 方法又做了同样的操作，导致可能重复扣款
- **修复方案**：统一由 `walletService` 处理余额变动，Store 只提供读取接口

### 三、【中等】逻辑漏洞

#### 3.1 接单状态机缺少 PAID → ACCEPTED 转换
- **位置**：[status-machine.js](file:///d:/campus-wexcx/campus-wexcx/utils/status-machine.js)
- **问题**：订单流程为 PENDING → PAID → ACCEPTED，但 `canTransition` 中 `PENDING` 可转到 `ACCEPTED`，跳过了支付环节
- **修复方案**：
```javascript
PENDING: ['PAID', 'CANCELLED'],  // 正确
PAID: ['ACCEPTED', 'CANCELLED'],  // 已修正
// 确保 acceptOrder 时订单状态为 PAID
```

#### 3.2 取消订单缺少状态校验
- **位置**：[detail.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/detail/detail.vue):231-247
- **问题**：`cancelOrder` 直接调用 `orderService.cancelOrder()` 和 `orderStore.updateOrderStatus()`，但没有先校验当前状态是否允许取消
- **修复方案**：增加 `canTransition(order.value.status, 'CANCELLED')` 判断

#### 3.3 订单详情页面重复更新状态
- **位置**：[detail.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/detail/detail.vue)
- **问题**：`confirmOrder`、`deliverOrder`、`cancelOrder` 都先调用 `orderService.xxxOrder()`（内部已调用 store 的 `updateOrderStatus`），又手动调用了一次 `orderStore.updateOrderStatus()`，导致重复执行
- **修复方案**：Service 层更新后不再在页面层重复调用

#### 3.4 帖子发布后没有刷新首页数据
- **位置**：[post.vue](file:///d:/campus-wexcx/campus-wexcx/pages/post/post.vue):148-176
- **问题**：`submitPost()` 成功后只是 `navigateBack()`，但首页的帖子列表不会自动刷新，新帖子不会出现在首页
- **修复方案**：发布成功后通过 `uni.$emit('refreshPosts')` 事件通知首页刷新，或在首页使用 `onShow` 重新加载

#### 3.5 搜索页面无确认搜索按钮的视觉提示
- **位置**：[search.vue](file:///d:/campus-wexcx/campus-wexcx/pages/search/search.vue)
- **问题**：虽然 `uni-search-bar` 有 `@confirm` 事件，但用户不知道可以按键盘的"搜索"按钮触发搜索，缺少明显的搜索按钮
- **修复方案**：在搜索栏右侧添加一个搜索按钮图标

### 四、【中等】性能瓶颈

#### 4.1 列表页面缺少分页实现
- **位置**：[list.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/list/list.vue)、[index.vue](file:///d:/campus-wexcx/campus-wexcx/campus-wexcx/pages/index/index.vue)
- **问题**：
  - `loadMore()` 函数在 list.vue 中直接设置 `nomore`，没有真正的分页逻辑
  - `index.vue` 的 `loadMore()` 是空实现（TODO）
  - 当订单/帖子数量增多时，一次性加载所有数据会导致卡顿
- **修复方案**：实现真正的分页加载，每次加载 10-20 条数据

#### 4.2 Mock 数据全局加载
- **位置**：所有 store 和 service 文件
- **问题**：`mockOrders`、`mockPosts` 等数据在每个页面加载时都被导入，当 Mock 数据量增大时会浪费内存
- **修复方案**：切换到后端 API 后删除 Mock 数据引用，或使用按需加载

#### 4.3 图片无懒加载
- **位置**：[index.vue](file:///d:/campus-wexcx/campus-wexcx/pages/index/index.vue)
- **问题**：帖子列表中的图片全部同时加载，当帖子数量多时会浪费带宽和内存
- **修复方案**：使用 `lazy-load` 属性或 `uni-image` 的懒加载功能

### 五、【轻微】代码质量问题

#### 5.1 缺失的页面文件
- **位置**：[pages.json](file:///d:/campus-wexcx/campus-wexcx/pages.json) 中注册了多个页面但未实现
- **问题**：以下页面仅在 `pages.json` 中注册，但可能缺少实际文件：
  - `pages/profile/my-posts/my-posts`
  - `pages/profile/my-comments/my-comments`
  - `pages/profile/my-watch/my-watch`
  - `pages/profile/my-favorites/my-favorites`
  - `pages/profile/service/*` (4个)
  - `pages/profile/settings/*` (4个)
  - `pages/hot/hot`
- **修复方案**：为所有注册的页面创建基础模板，或从 pages.json 中移除未实现的页面

#### 5.2 硬编码的用户信息
- **位置**：多个页面
- **问题**：用户昵称 `'神秘同学2054826543'`、头像 `'/static/logo.png'` 等在多个地方硬编码
- **修复方案**：统一从 `userStore.userInfo` 获取

#### 5.3 错误处理不完整
- **位置**：全局
- **问题**：大多数 `catch` 块只显示 "操作失败" toast，没有记录错误日志，不利于问题排查
- **修复方案**：添加 `console.error` 记录详细错误信息

#### 5.4 `validator.js` 中佣金校验阈值不一致
- **位置**：[validator.js](file:///d:/campus-wexcx/campus-wexcx/utils/validator.js):25-27
- **问题**：`validateOrderForm` 中检查 `num < 0`，但 `config.js` 中 `MIN_COMMISSION = 1`，阈值不一致
- **修复方案**：统一使用 `config.js` 中的 `MIN_COMMISSION` 常量

#### 5.5 消息类型图标映射不完整
- **位置**：[message.vue](file:///d:/campus-wexcx/campus-wexcx/pages/message/message.vue):71-73
- **问题**：`getMessageIcon` 和 `getMessageColor` 的映射中没有处理 `order` 类型消息，会 fallback 到默认值
- **修复方案**：为 `order` 类型添加对应的图标和颜色

### 六、【严重】业务逻辑问题

#### 6.1 支付页面金额同步问题
- **位置**：[publish.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/publish/publish.vue) → [payment.vue](file:///d:/campus-wexcx/campus-wexcx/campus-wexcx/pages/mutual/payment/payment.vue)
- **问题**：已通过 URL 参数传递修复，但支付成功后没有更新订单状态为 `PAID`
- **修复方案**：支付成功后调用 `orderStore.updateOrderStatus(orderId, 'PAID')`

#### 6.2 接单人认证检查被绕过
- **位置**：[list.vue](file:///d:/campus-wexcx/campus-wexcx/pages/mutual/list/list.vue):100-105
- **问题**：接单时检查 `user.certified`，但如果用户从其他入口（如直接访问订单详情页）可能绕过此检查
- **修复方案**：在 `orderService.acceptOrder` 中也增加认证检查

#### 6.3 钱包提现没有实际实现
- **位置**：[withdraw.vue](file:///d:/campus-wexcx/campus-wexcx/pages/profile/wallet/withdraw.vue)
- **问题**：提现页面可能是空的或只有基础框架，没有完整的提现表单和验证逻辑
- **修复方案**：检查并完善提现页面

---

## 修复优先级

| 优先级 | 问题编号 | 问题描述 | 影响范围 |
|--------|---------|---------|---------|
| P0 | 2.1, 6.1 | 订单创建/支付流程断裂 | 核心交易链路 |
| P0 | 2.2 | Store 与 Service 数据源不一致 | 订单列表显示 |
| P1 | 1.1, 1.2, 1.3 | 安全与隐私问题 | 用户数据安全 |
| P1 | 3.2, 3.3 | 订单状态操作重复执行 | 数据一致性 |
| P2 | 3.4 | 帖子发布后首页不刷新 | 用户体验 |
| P2 | 4.1 | 列表页面缺少分页 | 性能 |
| P2 | 5.1 | 缺失的页面文件 | 功能完整性 |
| P3 | 5.2-5.5 | 代码质量问题 | 可维护性 |

---

## 实施步骤

### 第一阶段（P0）：修复核心业务链路
1. 修复 `payment.vue` 支付逻辑，不再创建重复订单
2. 修复 `order-service.js` 的 `getOrders` 返回 store 数据
3. 添加支付成功后更新订单状态为 `PAID`

### 第二阶段（P1）：安全加固
1. 在关键页面添加登录态校验
2. 统一敏感信息脱敏处理
3. 设置 `urlCheck: true`

### 第三阶段（P2）：功能完善
1. 完善帖子发布后首页刷新机制
2. 实现列表分页加载
3. 创建缺失的页面文件

### 第四阶段（P3）：代码优化
1. 统一错误处理
2. 清理硬编码数据
3. 补充单元测试

---

## 测试验证方法

### 单元测试
- 测试订单状态机转换的正确性
- 测试表单校验规则（佣金、手机号等）
- 测试 Store 数据操作的原子性

### 集成测试
- 完整的发布→支付→接单→完成订单流程
- 帖子发布→首页显示→详情查看流程
- 消息点击→跳转对应页面流程

### 安全测试
- 未登录用户访问受保护页面
- 非接单人查看敏感信息
- 越权操作（取消他人订单等）

### 性能测试
- 大量帖子/订单列表加载性能
- 图片懒加载效果
- 页面切换流畅度

---

## 预防建议

1. **引入 ESLint + Prettier**：统一代码风格，减少低级错误
2. **引入 TypeScript**：增强类型安全，减少运行时错误
3. **建立 CI/CD 流程**：自动化测试和部署
4. **代码审查机制**：核心功能变更需经过 code review
5. **日志监控系统**：接入错误追踪平台（如 Sentry）
6. **API Mock 与真实接口并行**：开发阶段使用 Mock，上线前切换真实接口并充分测试
7. **编写接口文档**：明确前后端数据格式约定
8. **安全审查清单**：每次发布前检查敏感信息、权限校验、输入校验等

---

*报告生成时间：2026-04-21*  
*审计范围：整个校园互助平台 uni-app 项目*
