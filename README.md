<p align="center">
  <h1 align="center">智能教学辅助管理系统 · 教师端</h1>
  <p align="center">
    <strong>Vue 3 + Vite + Element Plus</strong> 构建的现代化教学管理平台
    <br>
    <a href="#-快速开始">快速开始</a> ·
    <a href="#-项目概述">项目概述</a> ·
    <a href="#-开发指南">开发指南</a> ·
    <a href="#-部署上线">部署上线</a>
  </p>
</p>

---

## 📑 目录

- [项目概述](#-项目概述)
- [环境准备](#-环境准备)
- [快速开始](#-快速开始)
- [项目结构](#-项目结构)
- [技术架构](#-技术架构)
- [功能模块](#-功能模块)
- [开发指南](#-开发指南)
- [配置说明](#-配置说明)
- [API 接口文档](#-api-接口文档)
- [认证与鉴权](#-认证与鉴权)
- [部署上线](#-部署上线)
- [开发规范](#-开发规范)
- [常见问题](#-常见问题)
- [贡献指南](#-贡献指南)
- [许可证](#-许可证)
- [联系方式](#-联系方式)

---

## 📖 项目概述

### 项目定位

智能教学辅助管理系统是一套面向高校教师的综合性 Web 应用，覆盖学生管理、课程组织、作业发布、考勤管理等日常教学场景。系统前端基于 **Vue 3 生态**构建，内置 Mock 数据服务，可脱离后端独立运行和演示。

### 设计目标

| 目标 | 说明 |
|------|------|
| **高效** | 一站式管理学生、课程、作业、考勤，减少教师重复劳动 |
| **直观** | 卡片式布局、筛选搜索、批量操作，降低使用门槛 |
| **可靠** | Token 认证、路由守卫、统一错误处理，保障数据安全 |
| **可扩展** | 模块化目录结构、Mock 驱动开发，便于功能迭代 |
| **易部署** | Docker 多阶段构建，一条命令即可上线 |

### 访问地址

| 环境 | 地址 | 说明 |
|------|------|------|
| 本地开发 | `http://localhost:5173` | Vite 开发服务器 |
| Docker 本地 | `http://localhost:8080` | Docker Compose 部署 |
| 生产环境 | `https://teaching-admin.your-domain.com` | 替换为实际域名 |

---

## 💻 环境准备

### 必需环境

| 软件 | 最低版本 | 推荐版本 | 检查命令 |
|------|----------|----------|----------|
| **Node.js** | `16.0.0` | `20.x LTS` | `node -v` |
| **npm** | `8.0.0` | `10.x` | `npm -v` |

### 可选环境

| 软件 | 说明 |
|------|------|
| **Git** | 版本控制（推荐 `2.30+`） |
| **Docker** | 容器化部署（推荐 `20.10+`） |
| **Docker Compose** | 服务编排（推荐 `2.0+`） |
| **VS Code** | 推荐编辑器 + Volar 插件 |

### 安装 Node.js

**Windows**：访问 [nodejs.org](https://nodejs.org) 下载 LTS 版本安装包，按向导完成安装。

**macOS**：
```bash
brew install node@20
```

**Linux**：
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

安装后验证：
```bash
node -v   # 应输出 v20.x.x 或更高
npm -v    # 应输出 10.x.x 或更高
```

---

## 🚀 快速开始

> 从克隆仓库到看到登录页面，约需 **3 分钟**。

### 第一步：克隆项目

```bash
git clone <仓库地址>
cd vite-project
```

> 如果没有 Git，直接下载 ZIP 解压到本地即可。

### 第二步：安装依赖

```bash
npm install
```

安装过程约 1-2 分钟。若遇到网络问题，可使用国内镜像：
```bash
npm install --registry=https://registry.npmmirror.com
```

### 第三步：启动开发服务器

```bash
npm run dev
```

终端将输出：
```
  VITE v8.0.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
```

浏览器打开 **http://localhost:5173**，看到登录页面即表示启动成功。

### 第四步：登录

使用内置测试账号登录：

| 用户名 | 密码 |
|--------|------|
| `teacher` | `123456` |

> 💡 如需修改账号密码，编辑 `mock/auth.js` 中的验证逻辑。

### 第五步：构建与预览（可选）

```bash
npm run build      # 生产构建，输出至 dist/ 目录
npm run preview    # 本地预览构建结果
```

### 环境验证清单

- [ ] `node -v` 输出版本号 ≥ 16.0.0
- [ ] `npm install` 无报错
- [ ] `npm run dev` 启动成功
- [ ] 浏览器打开 `http://localhost:5173` 可见登录页
- [ ] 使用 `teacher / 123456` 可成功登录

---

## 📁 项目结构

```
vite-project/
│
├── mock/                           # Mock 接口数据（开发环境专用）
│   ├── auth.js                     #   认证：登录 / 获取用户 / 退出
│   ├── students.js                 #   学生：CRUD + 分页搜索
│   ├── courses.js                  #   课程：CRUD + 批量删除
│   ├── homeworks.js                #   作业：列表 + 创建
│   ├── attendances.js              #   考勤：记录 + 统计 + 签到会话
│   ├── questions.js                #   题库：CRUD + AI 生成
│   ├── tests.js                    #   测试：CRUD + 批改
│   └── profile.js                  #   个人中心：信息 + 密码修改
│
├── public/                         # 静态资源（构建时原样复制到 dist/）
│
├── src/                            # 源代码
│   ├── api/                        # API 接口封装（每个模块一个文件）
│   │   ├── auth.js                 #   认证模块 API
│   │   ├── students.js             #   学生模块 API
│   │   ├── courses.js              #   课程模块 API
│   │   ├── homeworks.js            #   作业模块 API
│   │   ├── attendances.js          #   考勤模块 API
│   │   ├── questions.js            #   题库模块 API
│   │   ├── tests.js                #   测试模块 API
│   │   └── profile.js              #   个人中心 API
│   │
│   ├── assets/                     # 本地资源（图片、SVG 图标）
│   ├── components/                 # 可复用公共组件
│   │
│   ├── layouts/
│   │   └── AdminLayout.vue         # 后台布局框架
│   │       ├── 侧边栏（可折叠）      #   菜单导航 + 白底紫罗兰主题
│   │       ├── 顶部栏               #   面包屑 + 折叠按钮
│   │       └── 主内容区             #   <router-view /> 渲染区域
│   │
│   ├── router/
│   │   └── index.js                # 路由表 + beforeEach 守卫
│   │
│   ├── utils/
│   │   ├── auth.js                 # Token / 用户信息的 localStorage 存取
│   │   └── request.js              # Axios 实例 + 请求/响应拦截器
│   │
│   ├── views/                      # 页面视图组件
│   │   ├── Login.vue               #   登录页面
│   │   ├── Dashboard.vue           #   仪表盘首页
│   │   ├── students/               #   学生管理模块
│   │   ├── courses/                #   课程管理模块
│   │   ├── homeworks/              #   作业管理模块
│   │   ├── attendances/            #   考勤管理模块
│   │   ├── questions/              #   题库管理模块
│   │   ├── tests/                  #   测试管理模块
│   │   └── profile/                #   个人中心模块
│   │
│   ├── App.vue                     # Vue 根组件
│   ├── main.js                     # 应用入口（挂载 Vue 实例）
│   └── style.css                   # 全局样式 + CSS 工具类
│
├── Dockerfile                      # 多阶段构建配置
├── docker-compose.yml              # Docker Compose 配置
├── nginx.conf                      # Nginx 生产环境配置
├── .dockerignore                   # Docker 构建排除
├── deploy.sh                       # 一键部署脚本
├── .github/workflows/deploy.yml    # GitHub Actions CI/CD
│
├── index.html                      # HTML 入口文件
├── vite.config.js                  # Vite 构建配置
├── package.json                    # 项目元信息与依赖声明
├── package-lock.json               # 依赖版本锁定（自动生成）
└── README.md                       # 项目文档（本文件）
```

### 关键文件说明

| 文件 | 作用 | 何时修改 |
|------|------|----------|
| `mock/*.js` | 模拟后端接口数据 | 新增 API 或修改接口逻辑时 |
| `src/api/*.js` | 封装 HTTP 请求函数 | 新增接口调用时 |
| `src/router/index.js` | 路由定义与鉴权 | 新增页面或修改权限时 |
| `src/utils/request.js` | HTTP 客户端配置 | 修改超时、拦截器、baseURL 时 |
| `vite.config.js` | 构建工具配置 | 添加插件、修改构建选项时 |
| `nginx.conf` | 生产环境 Web 服务器配置 | 修改 Gzip、缓存、路由策略时 |

---

## 🏗 技术架构

### 前端技术栈

| 类别 | 技术 | 版本 | 用途 |
|------|------|------|------|
| 框架 | **Vue** | `^3.5.34` | 前端核心框架，采用 Composition API |
| 构建 | **Vite** | `^8.0.12` | 开发服务器 + 生产打包 |
| 路由 | **Vue Router** | `^5.1.0` | SPA 路由管理，History 模式 |
| UI | **Element Plus** | `^2.14.0` | 企业级 UI 组件库 |
| HTTP | **Axios** | `^1.16.1` | HTTP 客户端，拦截器封装 |
| Mock | **vite-plugin-mock** | `^3.0.2` | 本地 API 模拟 |

### 部署技术栈

| 类别 | 技术 | 用途 |
|------|------|------|
| 容器化 | **Docker** | 多阶段构建（`node:20-alpine` → `nginx:alpine`） |
| 编排 | **Docker Compose** | 单文件服务定义与启动 |
| Web 服务器 | **Nginx** | 静态文件服务 + 反向代理 + Gzip |
| CI/CD | **GitHub Actions** | 自动构建、测试、部署流水线 |

### 系统架构

```
                         ┌──────────────────┐
                         │     用户浏览器     │
                         └────────┬─────────┘
                                  │
                    ┌─────────────▼─────────────┐
                    │          Nginx             │
                    │  · 静态文件服务              │
                    │  · SPA 路由回退              │
                    │  · Gzip 压缩                │
                    │  · 安全响应头               │
                    │  · /api/* 反向代理（可选）   │
                    └──┬──────────────────────┬──┘
                       │                      │
              ┌────────▼─────┐      ┌────────▼─────┐
              │   静态文件     │      │   后端 API     │
              │   (dist/)    │      │   (可选)      │
              │   Vue SPA    │      │               │
              └──────────────┘      └──────────────┘
```

### 数据流

```
用户操作 → Vue 组件 → API 函数 (src/api/) → Axios 请求
                                                 │
                                    ┌────────────▼────────────┐
                                    │  开发环境 → Mock 拦截     │
                                    │  生产环境 → Nginx 代理    │
                                    └────────────┬────────────┘
                                                 │
                                    ┌────────────▼────────────┐
                                    │  统一响应 { code, msg, data }
                                    │  请求拦截器 ← Token 注入  │
                                    │  响应拦截器 ← 错误处理    │
                                    └─────────────────────────┘
```

---

## 📦 功能模块

| 序号 | 模块 | 路由 | 核心功能 |
|------|------|------|----------|
| 1 | **仪表盘** | `/dashboard` | 用户欢迎卡片、8 个功能入口快捷卡片 |
| 2 | **学生管理** | `/students` | 增删改查、关键字搜索、分页（5/10/20/50 条/页） |
| 3 | **课程管理** | `/courses` | 卡片网格展示、批量删除、课程详情、加课码复制 |
| 4 | **作业管理** | `/homeworks` | 发布作业、状态筛选（全部/未截止/已截止） |
| 5 | **考勤管理** | `/attendances` | 签到码生成、考勤统计、课程/日期筛选、分页 |
| 6 | **个人中心** | `/profile` | 个人信息编辑、密码修改 |

### 全局通用功能

- **身份认证**：JWT Token 机制，localStorage 持久化，路由守卫拦截未登录访问
- **错误处理**：Axios 拦截器统一捕获异常，弹出提示框，401 自动跳转登录页
- **响应式布局**：桌面端 / 平板 / 手机多端适配，侧边栏折叠支持
- **Mock 数据**：开发环境内置 8 个模块的完整 Mock，无需后端即可开发调试
- **分页组件**：学生管理、课程管理、考勤管理均支持分页

---

## 📝 开发指南

### 开发环境启动

```bash
# 安装依赖
npm install

# 启动开发服务器（支持热更新 HMR）
npm run dev
```

### 可用命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动 Vite 开发服务器（HMR 热更新） |
| `npm run build` | 生产环境构建，输出到 `dist/` 目录 |
| `npm run preview` | 本地预览构建产物 |

### 新增功能模块

以新增「通知管理」模块为例：

**1. 创建 Mock 接口**（`mock/notifications.js`）：
```javascript
let notifications = []

export default [
  {
    url: '/api/notifications',
    method: 'get',
    response: () => ({
      code: 0, message: 'ok', data: { list: notifications, total: notifications.length }
    })
  },
  {
    url: '/api/notifications',
    method: 'post',
    response: ({ body }) => {
      const item = { id: Date.now(), ...body, createdAt: new Date().toISOString() }
      notifications.unshift(item)
      return { code: 0, message: 'ok', data: item }
    }
  }
]
```

**2. 创建 API 封装**（`src/api/notifications.js`）：
```javascript
import request from '../utils/request'

export function getNotifications(params) {
  return request.get('/notifications', { params })
}

export function createNotification(data) {
  return request.post('/notifications', data)
}
```

**3. 创建页面组件**（`src/views/notifications/NotificationsList.vue`）：
```vue
<script setup>
import { ref, onMounted } from 'vue'
import { getNotifications } from '../../api/notifications'

const list = ref([])

onMounted(async () => {
  const res = await getNotifications()
  list.value = res.list
})
</script>
```

**4. 注册路由**（`src/router/index.js`）：
```javascript
{
  path: '/notifications',
  component: () => import('../views/notifications/NotificationsList.vue')
}
```

**5. 添加侧边栏菜单项**（`src/layouts/AdminLayout.vue`）：
```html
<el-menu-item index="/notifications">
  <span class="mi"><span class="mi-icon">🔔</span><span class="mi-text">通知管理</span></span>
</el-menu-item>
```

### 与后端联调

当需要连接真实后端时：

1. 创建 `.env` 文件：
```env
VITE_API_BASE_URL=https://api.your-server.com
```

2. 修改 `src/utils/request.js`：
```javascript
const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  timeout: 10000
})
```

3. 重启开发服务器使环境变量生效

---

## ⚙️ 配置说明

### Vite 配置

```javascript
// vite.config.js
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),                              // Vue 3 SFC 编译
    viteMockServe({
      mockPath: 'mock',                 // Mock 文件目录
      localEnabled: true                // 开发环境启用，生产环境自动禁用
    })
  ]
})
```

### 路由配置

```javascript
// src/router/index.js — 核心路由结构
const routes = [
  { path: '/login', component: Login },

  {
    path: '/',
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '', redirect: '/dashboard' },
      { path: 'dashboard', component: Dashboard },
      { path: 'students', component: StudentsList },
      { path: 'courses', component: CoursesList },
      { path: 'courses/:id', component: CourseDetail },
      { path: 'homeworks', component: () => import('../views/homeworks/HomeworksList.vue') },
      { path: 'homeworks/create', component: () => import('../views/homeworks/HomeworkCreate.vue') },
      { path: 'attendances', component: () => import('../views/attendances/AttendancesList.vue') },
      { path: 'profile', component: () => import('../views/profile/Profile.vue') }
    ]
  }
]
```

> 部分路由使用动态 `import()` 实现代码分割，Vite 会自动按模块拆包。

### 环境变量

Vite 使用 `dotenv` 加载 `.env` 文件。变量名必须以 `VITE_` 为前缀才能在客户端代码中访问：

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `VITE_API_BASE_URL` | 后端 API 基础地址 | `/api`（Mock 模式） |

### Mock 数据

Mock 数据位于 `mock/` 目录，由 `vite-plugin-mock` 自动加载。Mock 在以下场景生效：

- ✅ `npm run dev` 开发环境
- ❌ `npm run build` 生产构建（.dockerignore 已排除）
- ❌ `npm run preview` 预览模式

Mock 数据存储在模块级别的变量中，重新启动开发服务器后会重置为初始状态。

---

## 📡 API 接口文档

### 通用规范

| 项目 | 说明 |
|------|------|
| **Base URL** | `/api` |
| **认证方式** | `Authorization: Bearer <token>` |
| **超时时间** | `10000ms` |
| **Content-Type** | `application/json` |

### 统一响应体

```typescript
interface ApiResponse<T> {
  code: number      // 业务状态码：0 = 成功，非 0 = 失败
  message: string   // 状态描述
  data: T           // 响应数据
}
```

### 接口清单

#### 认证

| 方法 | 路径 | 请求体 | 响应说明 |
|------|------|--------|----------|
| `POST` | `/api/auth/login` | `{ username, password, remember }` | 返回 `{ token, user }` |
| `GET` | `/api/auth/me` | — | 返回当前用户信息 |
| `POST` | `/api/auth/logout` | — | 退出登录 |

#### 学生管理

| 方法 | 路径 | 参数 |
|------|------|------|
| `GET` | `/api/students` | Query: `keyword`, `page`, `pageSize` |
| `POST` | `/api/students` | Body: `{ studentNo, name, className, phone, email }` |
| `PUT` | `/api/students/:id` | Body: 同 POST |
| `DELETE` | `/api/students/:id` | — |

#### 课程管理

| 方法 | 路径 | 参数 |
|------|------|------|
| `GET` | `/api/courses` | Query: `keyword`, `page`, `pageSize` |
| `POST` | `/api/courses` | Body: `{ term, name, teacher, className, joinCode }` |
| `PUT` | `/api/courses/:id` | Body: 同 POST |
| `DELETE` | `/api/courses/:id` | — |
| `POST` | `/api/courses/batch-delete` | Body: `{ ids: number[] }` |

#### 作业管理

| 方法 | 路径 | 参数 |
|------|------|------|
| `GET` | `/api/homeworks` | Query: `status`（`all`/`open`/`closed`）, `page`, `pageSize` |
| `POST` | `/api/homeworks` | Body: `{ courseId, title, deadline, description }` |

#### 考勤管理

| 方法 | 路径 | 参数 |
|------|------|------|
| `GET` | `/api/attendances` | Query: `course`, `date`, `page`, `pageSize` |
| `GET` | `/api/attendances/stats` | Query: `course`, `date` |
| `POST` | `/api/attendances/session` | Body: `{ courseName, attendanceTime, duration }` |

#### 个人中心

| 方法 | 路径 | 参数 |
|------|------|------|
| `GET` | `/api/profile` | — |
| `PUT` | `/api/profile` | Body: `{ nickname, phone, email }` |
| `POST` | `/api/profile/change-password` | Body: `{ oldPassword, newPassword, confirmPassword }` |

---

## 🔒 认证与鉴权

### 认证流程

```
┌─────────┐     ┌──────────┐     ┌──────────────┐
│  登录页   │ ──→ │  Mock 验证 │ ──→ │  返回 Token   │
│ 输入账号  │     │ teacher   │     │  存入         │
│ 输入密码  │     │ 123456    │     │  localStorage │
└─────────┘     └──────────┘     └──────┬───────┘
                                        │
                          ┌─────────────▼─────────────┐
                          │    每次 HTTP 请求            │
                          │    Axios 拦截器自动注入       │
                          │    Authorization: Bearer xxx │
                          └─────────────────────────────┘
```

### 路由守卫

```javascript
// src/router/index.js
router.beforeEach((to) => {
  const token = getToken()

  // 已登录用户访问 /login → 重定向到首页
  if (to.path === '/login' && token) {
    return '/dashboard'
  }

  // 未登录用户访问需认证页面 → 跳转登录
  if (to.meta.requiresAuth && !token) {
    return '/login'
  }

  return true
})
```

### Axios 拦截器

```javascript
// src/utils/request.js — 请求拦截器
request.interceptors.request.use((config) => {
  const token = getToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器
request.interceptors.response.use(
  (resp) => {
    const res = resp.data
    if (res.code === 0) return res.data       // 成功 → 返回数据
    ElMessage.error(res.message || '请求失败')  // 失败 → 提示
    return Promise.reject(res)
  },
  (err) => {
    if (err?.response?.status === 401) {       // Token 过期
      clearAuth()
      location.href = '/login'
    } else {
      ElMessage.error(err?.message || '网络错误')
    }
    return Promise.reject(err)
  }
)
```

---

## 🚀 部署上线

### 构建生产包

```bash
npm run build
```

构建产物位于 `dist/` 目录，包含：
- `index.html` — 入口 HTML
- `assets/` — 带 hash 的 JS、CSS、图片文件

### Nginx 部署

将 `dist/` 目录部署到 Nginx 服务器，核心配置：

```nginx
server {
    listen       80;
    server_name  your-domain.com;
    root         /path/to/dist;
    index        index.html;

    # SPA History 模式路由回退
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源长缓存
    location ~* \.(js|css|png|jpg|gif|svg|woff|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # API 反向代理（连接后端时使用）
    location /api {
        proxy_pass http://backend-server:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

### Docker 部署

**构建架构**：

```
阶段 1: node:20-alpine
  ├── COPY package*.json
  ├── RUN npm ci
  ├── COPY .
  └── RUN npm run build → /app/dist

阶段 2: nginx:alpine
  ├── COPY --from=builder /app/dist → /usr/share/nginx/html
  ├── COPY nginx.conf → /etc/nginx/nginx.conf
  ├── EXPOSE 80
  └── CMD ["nginx", "-g", "daemon off;"]
```

**常用命令**：

```bash
# 构建并启动（首次或代码更新后）
docker compose up -d --build

# 仅启动（无代码变更时）
docker compose up -d

# 查看运行状态
docker compose ps

# 查看实时日志
docker compose logs -f

# 停止并清理
docker compose down

# 一键交互式部署
chmod +x deploy.sh && ./deploy.sh
```

**Docker Compose 配置**：

| 配置项 | 值 | 说明 |
|--------|-----|------|
| 容器名 | `teaching-admin` | 唯一标识 |
| 端口映射 | `8080:80` | 宿主机 8080 → 容器 80 |
| 重启策略 | `unless-stopped` | 异常退出自动重启 |
| 健康检查 | `curl -f http://localhost/` | 每 30s 探测 |
| 时区 | `Asia/Shanghai` | 东八区 |

部署后访问 **http://localhost:8080**。

### CI/CD 自动部署

项目包含 GitHub Actions 工作流（`.github/workflows/deploy.yml`），推送至 `main`/`master` 分支自动触发：

```
代码推送 → npm ci → npm build → Docker 构建 → Docker Hub 推送 → SSH 部署
```

**启用步骤**：

1. 将项目推送到 GitHub
2. 在仓库 **Settings → Secrets and variables → Actions** 添加密钥：

| 密钥 | 说明 | 必填 |
|------|------|------|
| `DOCKER_HUB_USERNAME` | Docker Hub 用户名 | 是 |
| `DOCKER_HUB_TOKEN` | Docker Hub Token | 是 |
| `SSH_HOST` | 服务器 IP | 自动部署时 |
| `SSH_USER` | SSH 用户名 | 自动部署时 |
| `SSH_PRIVATE_KEY` | SSH 私钥 | 自动部署时 |

---

## 📏 开发规范

### 代码规范

| 规则 | 说明 |
|------|------|
| **组件语法** | 统一使用 Vue 3 `<script setup>` Composition API |
| **样式作用域** | 组件样式使用 `<style scoped>` |
| **异步处理** | `async/await` + `try/catch/finally` |
| **命名** | 组件 PascalCase，工具函数 camelCase，API 函数前缀 `use`/`get`/`create`/`update`/`delete` |
| **响应式** | 基本类型用 `ref()`，对象用 `reactive()`，计算属性用 `computed()` |
| **模板规范** | 避免模板中写复杂逻辑，使用 `computed` 预处理 |

### 设计规范

| 规范 | 值 |
|------|-----|
| 主色调 | `#667eea → #764ba2`（紫罗兰渐变） |
| 边框色 | `#eef0f5` |
| 表头背景 | `#fafbfc` + 2px 底部边框 |
| 行悬停 | `#f7f5ff`（淡紫） |
| 卡片圆角 | `12px` |
| 输入框圆角 | `8px` |
| 状态标签圆角 | `12px` |
| 代码字体 | `'Courier New', Consolas, monospace` |

### 目录规范

```
新建模块时遵循以下规则：
├── mock/module.js          # Mock 数据
├── src/api/module.js       # API 封装
└── src/views/module/       # 页面组件（一个或多个）
    ├── ModuleList.vue      # 列表页
    ├── ModuleCreate.vue    # 创建页（可选）
    └── ModuleDetail.vue    # 详情页（可选）
```

### Git 提交规范

```
<type>: <description>
```

| 类型 | 说明 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat: 添加考勤分页功能` |
| `fix` | Bug 修复 | `fix: 修复签到码生成报错` |
| `docs` | 文档更新 | `docs: 更新 README 部署章节` |
| `style` | 样式调整 | `style: 统一边框颜色` |
| `refactor` | 重构 | `refactor: 提取公共分页逻辑` |
| `chore` | 构建/工具 | `chore: 升级 Vite 至 8.0` |

### 分支策略

```
main               ← 生产分支，保持稳定
  ├── feature/xxx  ← 功能开发
  ├── fix/xxx      ← Bug 修复
  └── docs/xxx     ← 文档变更
```

### 开发流程

```bash
git checkout -b feature/my-feature   # 1. 创建功能分支
# ... 开发 ...
git add .                            # 2. 暂存变更
git commit -m "feat: 功能描述"        # 3. 提交
git push origin feature/my-feature   # 4. 推送
# 5. 在 GitHub 创建 Pull Request
```

---

## ❓ 常见问题

### Q: 启动后页面白屏？

A: 检查终端是否有编译错误。确认 Node.js 版本 ≥ 16，尝试删除 `node_modules` 后重新 `npm install`。

### Q: 登录提示"账号或密码错误"？

A: Mock 模式下的账号密码固定为 `teacher` / `123456`。如需修改，编辑 `mock/auth.js` 中的验证条件。

### Q: Mock 数据新增后刷新就没了？

A: Mock 数据存储在内存中，重启开发服务器会重置。如需持久化，连接真实后端或将数据写入文件。

### Q: 如何连接真实后端？

A: 创建 `.env` 文件设置 `VITE_API_BASE_URL=你的后端地址`，并修改 `src/utils/request.js` 使用环境变量。详见 [配置说明](#-配置说明)。

### Q: Docker 构建失败？

A: 确认 Docker 版本 ≥ 20.10，检查 `.dockerignore` 是否误排除了必要文件（如 `.env`、`package.json`）。

### Q: 如何新增一个页面？

A: 按照 [开发指南 → 新增功能模块](#新增功能模块) 的 5 步流程操作：Mock → API → Vue 组件 → 路由 → 菜单项。

---

## 🤝 贡献指南

欢迎为项目做出贡献！

### 贡献流程

1. **Fork** 本仓库到你的 GitHub 账户
2. **Clone** 到本地：`git clone <你的 Fork 地址>`
3. 创建分支：`git checkout -b feature/your-feature`
4. 编写代码并测试：`npm run build` 确保构建成功
5. 提交代码：`git commit -m "feat: 功能描述"`
6. 推送分支：`git push origin feature/your-feature`
7. 在 GitHub 上创建 **Pull Request** 到主仓库的 `main` 分支

### 提交前检查清单

- [ ] 代码风格符合项目规范（Composition API、scoped 样式）
- [ ] 新功能已添加 Mock 数据支持
- [ ] `npm run build` 无错误
- [ ] 提交信息遵循 `type: description` 格式
- [ ] 未引入敏感信息（密码、Token、密钥等）

---

## 📄 许可证

本项目基于 **MIT License** 开源。

> MIT License — 可自由使用、复制、修改、合并、出版发行、再授权及销售软件副本。软件按"原样"提供，不提供任何形式的明示或暗示担保。

---

## 📞 联系方式

| 渠道 | 地址 |
|------|------|
| **官网** | [https://teaching-admin.your-domain.com](https://teaching-admin.your-domain.com) |
| **邮箱** | 2325182440@qq.com |
| **问题反馈** | [GitHub Issues](https://github.com/your-username/teaching-admin/issues) |

---

<p align="center">
  <sub>Made with ❤️ for better education</sub>
  <br><br>
  <strong>智能教学辅助管理系统 · 教师端</strong>
  <br>
  让教学管理更高效
</p>
