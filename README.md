# Campus Mutual Aid Platform (校园互助平台)

> A WeChat mini-program built with uni-app + Vue 3 + Pinia for campus peer-to-peer assistance services.

[![Vue 3](https://img.shields.io/badge/Vue-3.x-4FC08D?logo=vue.js)](https://vuejs.org/)
[![uni-app](https://img.shields.io/badge/uni--app-Latest-2B5C82?logo=vue.js)](https://uniapp.dcloud.io/)
[![Pinia](https://img.shields.io/badge/Pinia-State%20Management-FFD43B?logo=vue.js)](https://pinia.vuejs.org/)
[![WeChat](https://img.shields.io/badge/Platform-WeChat%20Mini%20Program-07C160?logo=wechat)](https://developers.weixin.qq.com/miniprogram/dev/framework/)
[![SCSS](https://img.shields.io/badge/Styles-SCSS-CD6799?logo=sass)](https://sass-lang.com/)
[![License](https://img.shields.io/badge/License-MIT-blue)](LICENSE)

---

## Table of Contents

- [Project Overview](#project-overview)
- [Tech Stack](#tech-stack)
- [Features](#features)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Performance Optimization](#performance-optimization)
- [Code Quality](#code-quality)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

---

## Project Overview

Campus Mutual Aid Platform is a WeChat mini-program designed to facilitate peer-to-peer assistance services among university students. Users can post requests for help (package pickup, food delivery, errands, etc.), and other students can accept these tasks for compensation.

### Business Value

- **Information Aggregation**: Centralize campus information (lost & found, events, part-time jobs, second-hand trading)
- **Social Connection**: Provide anonymous or real-name social spaces for students
- **Mutual Aid Ecosystem**: Build a convenient errand assistance platform
- **Efficiency**: Help students solve problems and access resources quickly

### Target Users

| Role | Description | Core Needs |
|------|-------------|------------|
| **Student (Browser)** | Primarily browse information, participate in discussions | Quickly access campus hot topics |
| **Poster (Contributor)** | Share information, seek help | Conveniently publish posts, manage content |
| **Requester** | Need help completing tasks | Quickly publish requests, secure payment |
| **Runner (Task Taker)** | Earn money by helping others | Easily find and accept tasks |
| **Admin** | Content moderation, user management | Efficient moderation, handle violations |

---

## Tech Stack

### Core Frameworks

| Technology | Purpose | Version |
|------------|---------|---------|
| **uni-app** | Cross-platform mini-program framework | Latest |
| **Vue 3** | Progressive JavaScript framework | 3.x |
| **Pinia** | Vue 3 official state management | Latest |
| **SCSS** | CSS preprocessor | Latest |

### UI & Components

| Technology | Purpose |
|------------|---------|
| **uni-ui** | Official uni-app component library |
| **vu-icons** | Icon library for mini-programs |

### Development Tools

| Tool | Purpose |
|------|---------|
| **HBuilderX** | Official IDE for uni-app development |
| **WeChat DevTools** | Mini-program debugging and preview |

---

## Features

### Core Features

- [x] **User Authentication**: Mock-based login system with role-based access control
- [x] **Order Management**: Create, browse, accept, and track assistance orders
- [x] **Wallet System**: Balance tracking, income statistics, withdrawal requests
- [x] **Message Center**: System notifications, order updates, comment alerts
- [x] **Post Publishing**: Rich text editor for campus posts and announcements
- [x] **Search Functionality**: Find orders, posts, and users
- [x] **Profile Management**: User info, statistics, settings

### Technical Highlights

- [x] **Subpackage Loading**: Optimized main package size with code splitting
- [x] **Error Handling Middleware**: Unified error classification and user feedback
- [x] **Request Interceptors**: Automatic token injection, retry mechanism
- [x] **Pagination Support**: Efficient long-list rendering with lazy loading
- [x] **Data Source Adapter**: Decoupled Mock/API layers for seamless transition
- [x] **Local Storage Management**: Prefix isolation, TTL support, error handling

---

## Architecture

### Layered Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    View Layer (Pages)                    │
│  Login │ Home │ Hot │ Mutual │ Message │ Profile │ Post  │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                 Component Layer                          │
│  OrderCard │ EmptyState │ LazyImage │ StatusTag          │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                State Management (Pinia)                  │
│  userStore │ orderStore │ walletStore │ messageStore     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  Service Layer                           │
│  user-service │ order-service │ wallet-service │ ...     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   Data Layer                             │
│  Mock Data (Dev)  ←→  Real API (Prod)                   │
└─────────────────────────────────────────────────────────┘
```

### Package Structure

| Package | Pages | Description |
|---------|-------|-------------|
| **Main** | Login, Home, Hot, Mutual List, Post List, Message, Search, Profile | Core TabBar pages |
| **mutual** | Order Detail, Publish, Payment, Auth | Mutual aid module |
| **profile** | Center, Wallet, My Posts/Comments/Watches/Favorites, Settings | User module (15 pages) |
| **post** | Editor, Detail | Post module |

---

## Getting Started

### Prerequisites

- **HBuilderX** 3.1.0+ (recommended)
- **WeChat DevTools** (for mini-program preview)
- **Node.js** 14+ (for dependencies)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/campus-wexcx.git
   cd campus-wexcx/campus-wexcx
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Open in HBuilderX**

   - Open HBuilderX
   - File → Open → Select the `campus-wexcx` directory

4. **Run the project**

   - In HBuilderX: Run → Run to Mini-Program → WeChat DevTools
   - Or use CLI: `npm run dev:mp-weixin`

### Test Accounts

| Username | Password | Role | Description |
|----------|----------|------|-------------|
| `student` | `123456` | Student | Regular user |
| `runner` | `123456` | Runner | Certified task taker |
| `admin` | `admin123` | Admin | System administrator |

---

## Project Structure

```
campus-wexcx/
├── pages/                    # Page components
│   ├── login/               # Login page
│   ├── index/               # Home page
│   ├── hot/                 # Hot topics
│   ├── mutual/              # Mutual aid module (subpackage)
│   │   ├── list/           # Order list
│   │   ├── detail/         # Order detail
│   │   ├── publish/        # Publish request
│   │   ├── payment/        # Payment
│   │   └── auth/           # Runner certification
│   ├── post/                # Post module (subpackage)
│   │   ├── editor/         # Post editor
│   │   └── detail/         # Post detail
│   ├── message/             # Message center
│   ├── search/              # Search page
│   └── profile/             # Profile module (subpackage)
│       ├── index/          # Profile home
│       ├── center/         # Profile center
│       ├── wallet/         # Wallet
│       ├── my-posts/       # My posts
│       ├── my-comments/    # My comments
│       ├── my-watch/       # My watches
│       ├── my-favorites/   # My favorites
│       ├── service/        # Service & support
│       └── settings/       # Settings
├── components/              # Global reusable components
│   ├── empty-state/        # Empty state display
│   ├── lazy-image/         # Lazy loading image
│   ├── order-card/         # Order card
│   └── status-tag/         # Status tag
├── stores/                  # Pinia state management
│   ├── index.js            # Store entry point
│   ├── user-store.js       # User state
│   ├── order-store.js      # Order state
│   ├── wallet-store.js     # Wallet state
│   └── message-store.js    # Message state
├── services/                # API service layer
│   ├── index.js            # Service entry point
│   ├── user-service.js     # User API
│   ├── order-service.js    # Order API
│   ├── wallet-service.js   # Wallet API
│   ├── post-service.js     # Post API
│   ├── message-service.js  # Message API
│   └── payment-service.js  # Payment API
├── mock/                    # Mock data
│   ├── index.js            # Mock entry point
│   ├── user.js             # User mock data
│   ├── order.js            # Order mock data
│   ├── wallet.js           # Wallet mock data
│   ├── post.js             # Post mock data
│   └── message.js          # Message mock data
├── utils/                   # Utility functions
│   ├── storage.js          # Local storage wrapper
│   ├── request.js          # HTTP request wrapper
│   ├── error-handler.js    # Error handling middleware
│   ├── data-source.js      # Data source adapter
│   ├── pagination.js       # Pagination composable
│   ├── validator.js        # Form validation
│   ├── format.js           # Data formatting
│   └── status-machine.js   # Order status machine
├── static/                  # Static assets
│   ├── tabbar/             # TabBar icons
│   └── logo.png            # App logo
├── uni_modules/            # uni-app official components
├── pages.json              # Page routing config
├── manifest.json           # App config
├── config.js               # Global config
├── uni.scss                # Global SCSS variables
├── App.vue                 # App root component
├── main.js                 # App entry point
├── .gitignore              # Git ignore rules
└── README.md               # This file
```

---

## Development Guide

### Adding a New Page

1. Create page directory under `pages/`
2. Add route config to `pages.json` (main or subpackage)
3. Implement Vue component

### Adding a New Store

1. Create store file in `stores/`
2. Import and register in `stores/index.js`
3. Use in components with `useXxxStore()`

### Adding a New Service

1. Create service file in `services/`
2. Import and export in `services/index.js`
3. Call service from store or component

### Mock Data Management

- Toggle Mock mode in `config.js`: `USE_MOCK = true/false`
- Update mock data in `mock/` directory
- Services automatically switch based on config

---

## Performance Optimization

### Implemented Optimizations

| Optimization | Description | Impact |
|--------------|-------------|--------|
| **Subpackage Loading** | Split pages into 3 subpackages (mutual, profile, post) | ~60% main package size reduction |
| **Lazy Image Loading** | `lazy-image` component defers image loading until visible | Reduced initial render time |
| **Pagination Support** | `usePagination` composable for efficient list rendering | Lower memory usage |
| **Request Retry** | Automatic retry on network failure (configurable count/delay) | Improved reliability |
| **Token Caching** | JWT token cached in localStorage | Fewer auth failures |
| **Debounce/Throttle** | Utility functions to prevent excessive function calls | Better scroll/input performance |

### Lighthouse Targets

| Metric | Target | Current (Est.) |
|--------|--------|----------------|
| Performance | ≥ 90 | TBD |
| Accessibility | ≥ 95 | TBD |
| Best Practices | ≥ 90 | TBD |
| SEO | ≥ 90 | TBD |

---

## Code Quality

### ESLint Configuration

```javascript
// .eslintrc.js (planned)
module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    'vue/setup-compiler-macros': true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    parser: '@babel/eslint-parser'
  }
}
```

### Code Style Rules

- **Indentation**: 2 spaces
- **Semicolons**: Required
- **Quotes**: Single quotes
- **Trailing commas**: ES5
- **Max line length**: 100 characters

---

## Testing

### Test Strategy (Planned)

| Test Type | Tool | Target Coverage |
|-----------|------|-----------------|
| Unit Tests | Vitest | Core logic ≥ 80% |
| Component Tests | Vue Test Utils | Key components ≥ 70% |
| Integration Tests | Custom scripts | API flows 100% |
| Manual Tests | WeChat DevTools | Full flow coverage |

### Test Accounts for QA

Use the test accounts listed in [Getting Started](#test-accounts) for manual testing.

---

## Deployment

### Build for Production

1. **HBuilderX**: Run → Build → WeChat Mini-Program
2. **CLI**: `npm run build:mp-weixin`

### Upload to WeChat

1. Open WeChat DevTools
2. Import built project from `unpackage/dist/build/mp-weixin/`
3. Upload with version number
4. Submit for review in WeChat Mini-Program Admin Console

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Testing
- `chore:` Build/tooling

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [uni-app](https://uniapp.dcloud.io/) - Cross-platform mini-program framework
- [Vue 3](https://vuejs.org/) - Progressive JavaScript framework
- [Pinia](https://pinia.vuejs.org/) - Vue 3 state management

---

## Contact

- **Project**: Campus Mutual Aid Platform
- **Role**: Front-end Developer
- **Purpose**: Internship Application Project

> This project demonstrates proficiency with Vue 3, Pinia, uni-app, state management, error handling, performance optimization, and code quality practices.
