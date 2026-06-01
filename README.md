
# 智能教学辅助管理系统 (教师端)

[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/codezzj/teaching-admin-vue/blob/master/LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![Vite Version](https://img.shields.io/badge/vite-8.0.x-blue)](https://vitejs.dev/)
[![Vue Version](https://img.shields.io/badge/vue-3.5.x-green)](https://vuejs.org/)
[![GitHub Actions](https://github.com/codezzj/teaching-admin-vue/actions/workflows/deploy.yml/badge.svg)](https://github.com/codezzj/teaching-admin-vue/actions)
[![Demo](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://codezzj.github.io/teaching-admin-vue/login)

基于 Vue 3 + Vite + Element Plus 构建的现代化教学管理平台，为高校教师提供一站式教学管理解决方案。

---

## 目录

- [项目概述](#项目概述)
- [核心功能](#核心功能)
- [技术架构](#技术架构)
- [环境要求](#环境要求)
- [快速开始](#快速开始)
- [项目结构](#项目结构)
- [配置说明](#配置说明)
- [部署指南](#部署指南)
- [使用指南](#使用指南)
- [API 文档](#api-文档)
- [开发指南](#开发指南)
- [贡献规范](#贡献规范)
- [版本历史](#版本历史)
- [常见问题](#常见问题)
- [许可证](#许可证)
- [联系方式](#联系方式)

---

## 项目概述

智能教学辅助管理系统是一套面向高校教师的综合性教学管理 Web 应用。通过现代化的前端技术栈，为教师提供题库管理、测试管理、作业管理、考勤管理等核心功能模块，并创新性地引入 AI 辅助出题和自动批改功能，有效提升教学效率。

### 主要特性

- 🎯 **高效便捷** - 一站式管理，减少重复劳动
- 🤖 **AI 赋能** - 智能出题、自动批改
- 📊 **数据驱动** - 统计分析、决策支持
- 🔒 **安全可靠** - Token 认证、权限控制
- 📱 **响应式设计** - 多端适配、体验优秀
- 🚀 **快速部署** - CI/CD 自动化

### 项目信息

| 属性 | 值 |
|------|-----|
| 项目名称 | 智能教学辅助管理系统（教师端） |
| 仓库地址 | [https://github.com/codezzj/teaching-admin-vue](https://github.com/codezzj/teaching-admin-vue) |
| 演示地址 | [https://codezzj.github.io/teaching-admin-vue/login](https://codezzj.github.io/teaching-admin-vue/login) |
| 版本号 | 1.0.0 |
| 构建时间 | 2025-06-01 |
| 开发环境 | Node.js ≥ 18.x |
| 路由模式 | Hash 模式（`createWebHashHistory`） |
| 状态管理 | Composition API（ref / reactive） |

---

## 核心功能

### 📚 题库管理

- 题目增删改查（CRUD）
- 多题型支持（单选、多选、判断、简答）
- 题目分类（按课程、知识点、难度）
- 高级筛选和搜索
- AI 智能出题功能
- 题目导入功能

### 🧪 测试管理

- 创建和管理测试
- 题目选择和组卷
- 手动批改功能
- AI 一键自动批改

### 📝 作业管理

- 发布和查看作业
- 设置截止时间
- 状态筛选（未截止/已截止）

### 📊 考勤管理

- 签到记录管理
- 签到码生成
- 考勤统计分析
- 课程/日期筛选

### 🎓 课程管理

- 课程列表展示
- 课程创建和编辑
- 课程详情查看
- 加课码生成和复制

### 👤 学生管理

- 学生信息管理
- 学生列表和搜索
- 学生详情查看

### 🔐 用户中心

- 个人信息管理
- 密码修改
- 安全设置

---

## 技术架构

### 技术栈

| 类别 | 技术 | 版本 | 说明 |
|------|------|------|------|
| **前端框架** | Vue | ^3.5.34 | 渐进式 JavaScript 框架 |
| **构建工具** | Vite | ^8.0.12 | 新一代前端构建工具 |
| **UI 组件库** | Element Plus | ^2.14.0 | 企业级 Vue 组件库 |
| **路由管理** | Vue Router | ^5.1.0 | SPA 路由管理器 |
| **HTTP 客户端** | Axios | ^1.16.1 | 基于 Promise 的 HTTP 库 |
| **Mock 服务** | vite-plugin-mock | ^3.0.2 | Vite Mock 插件 |
| **包管理** | npm | - | Node 包管理器 |

### 系统架构

```
┌─────────────────────────────────────────────────────────────┐
│                        浏览器层                               │
│  ┌─────────────────────────────────────────────────────┐    │
│  │                  Vue SPA                             │    │
│  │  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐  │    │
│  │  │ Login.vue   │ │ AdminLayout │ │    Views    │  │    │
│  │  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘  │    │
│  └─────────┼───────────────┼───────────────┼──────────┘    │
│            │               │               │               │
│  ┌─────────▼───────────────▼───────────────▼──────────┐    │
│  │                   业务层                            │    │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ │    │
│  │  │   Router     │ │   Store      │ │   Hooks      │ │    │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ │    │
│  └─────────┼────────────────┼────────────────┼──────────┘    │
│            │                │                │               │
│  ┌─────────▼────────────────▼────────────────▼──────────┐    │
│  │                   数据层                              │    │
│  │  ┌────────────────────────────────────────────────┐ │    │
│  │  │               Axios HTTP Client                 │ │    │
│  │  │          (Request/Response Interceptors)       │ │    │
│  │  └───────────────────────┬────────────────────────┘ │    │
│  └──────────────────────────┼───────────────────────────┘    │
└─────────────────────────────┼───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌─────────────────┐    ┌────────────────┐
│ 开发环境      │    │  生产环境       │    │  GitHub Pages  │
│ Mock Service  │    │  后端 API      │    │  静态部署     │
└───────────────┘    └─────────────────┘    └────────────────┘
```

---

## 环境要求

### 运行环境

| 环境 | 版本要求 | 说明 |
|------|---------|------|
| Node.js | ≥ 18.0.0 | JavaScript 运行环境 |
| npm | ≥ 9.0.0 | 包管理器（随 Node.js 安装） |
| Git | ≥ 2.0 | 版本控制（可选） |
| Docker | ≥ 20.10 | 容器部署（可选） |

### 操作系统

| 系统 | 支持版本 |
|------|---------|
| Windows | Windows 10 / 11（推荐） |
| macOS | macOS 12 Monterey 及以上 |
| Linux | Ubuntu 20.04+ / CentOS 7+ / Debian 11+ |

### 浏览器兼容

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | ≥ 90 |
| Edge | ≥ 90 |
| Firefox | ≥ 90 |
| Safari | ≥ 15 |

> ⚠️ 不支持 IE 浏览器（IE 已于 2022 年终止支持）。

### 推荐开发工具

| 工具 | 用途 |
|------|------|
| [VS Code](https://code.visualstudio.com/) | 代码编辑器（推荐） |
| [Vue DevTools](https://devtools.vuejs.org/) | Vue 调试工具（浏览器扩展） |
| [Postman](https://www.postman.com/) | API 调试工具 |

---

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/codezzj/teaching-admin-vue.git
cd teaching-admin-vue
```

### 2. 安装依赖

```bash
# 使用 npm 安装
npm install

# 使用国内镜像（可选）
npm install --registry=https://registry.npmmirror.com
```

### 3. 启动开发服务器

```bash
npm run dev
```

启动成功后，终端会输出访问地址，默认格式为：

```
http://localhost:5173/teaching-admin-vue/
```

> 💡 Vite 默认端口为 `5173`，若端口被占用会自动递增（如 `5174`、`5175`），请以终端实际输出为准。
> ⚠️ 项目配置了 `base: '/teaching-admin-vue/'`，直接访问根路径（如 `http://localhost:5173`）会返回 404。

### 4. 登录系统

使用测试账号登录：

| 用户名 | 密码 |
|--------|------|
| `teacher` | `123456` |

### 5. 构建生产版本

```bash
npm run build
```

构建产物将输出到 `dist` 目录。

### 6. 预览生产构建

```bash
npm run preview
```

---

## 项目结构

```
vite-project/
├── .github/
│   └── workflows/
│       └── deploy.yml              # GitHub Actions 部署配置
├── .vscode/
│   └── extensions.json             # VS Code 推荐扩展
├── mock/                           # Mock 模拟数据（vite-plugin-mock）
│   ├── auth.js                     #   登录/认证接口
│   ├── students.js                 #   学生 CRUD + 分页搜索
│   ├── courses.js                  #   课程 CRUD + 批量删除
│   ├── homeworks.js                #   作业发布 + 状态筛选
│   ├── attendances.js              #   考勤记录 + 统计 + 签到码
│   ├── questions.js                #   题库 CRUD + AI 生成
│   ├── tests.js                    #   测试创建 + AI 批改
│   └── profile.js                  #   个人信息 + 密码修改
├── public/                         # 静态资源目录
│   ├── favicon.svg
│   └── icons.svg
├── src/                            # 源代码目录
│   ├── api/                        # API 接口封装
│   │   ├── auth.js
│   │   ├── students.js
│   │   ├── courses.js
│   │   ├── homeworks.js
│   │   ├── attendances.js
│   │   ├── questions.js
│   │   ├── tests.js
│   │   └── profile.js
│   ├── assets/                     # 资源文件
│   │   ├── hero.png
│   │   ├── vite.svg
│   │   └── vue.svg
│   ├── components/                 # 公共组件
│   │   └── HelloWorld.vue
│   ├── layouts/                    # 布局组件
│   │   └── AdminLayout.vue
│   ├── router/                     # 路由配置
│   │   └── index.js
│   ├── utils/                      # 工具函数
│   │   ├── auth.js                 # 认证工具
│   │   └── request.js              # Axios 实例配置
│   ├── views/                      # 页面组件
│   │   ├── Login.vue               #   登录页
│   │   ├── Dashboard.vue           #   首页仪表盘
│   │   ├── students/
│   │   │   └── StudentsList.vue    #   学生管理
│   │   ├── courses/
│   │   │   ├── CoursesList.vue     #   课程管理（卡片列表）
│   │   │   └── CourseDetail.vue    #   课程详情
│   │   ├── homeworks/
│   │   │   ├── HomeworksList.vue   #   作业列表
│   │   │   └── HomeworkCreate.vue  #   发布作业
│   │   ├── attendances/
│   │   │   └── AttendancesList.vue #   考勤管理
│   │   ├── questions/
│   │   │   └── QuestionsList.vue   #   题库管理
│   │   ├── tests/
│   │   │   ├── TestsList.vue       #   测试列表
│   │   │   ├── TestCreate.vue      #   创建测试
│   │   │   └── TestDetail.vue      #   测试批改
│   │   └── profile/
│   │       └── Profile.vue         #   个人中心
│   ├── App.vue                     # 根组件
│   ├── main.js                     # 入口文件
│   └── style.css                   # 全局样式
├── .dockerignore                   # Docker 忽略文件
├── .gitignore                      # Git 忽略文件
├── Dockerfile                      # Docker 镜像构建（多阶段）
├── docker-compose.yml              # Docker Compose 编排
├── nginx.conf                      # Nginx 配置（Gzip/Security Headers）
├── deploy.sh                       # 一键部署脚本
├── index.html                      # HTML 入口
├── vite.config.js                  # Vite 配置（含 Mock 插件）
├── package.json                    # 项目依赖配置
└── package-lock.json               # 依赖锁定文件
```

### 关键文件说明

| 文件路径 | 说明 |
|---------|------|
| `src/main.js` | 应用入口文件（初始化 Vue、Router、Element Plus） |
| `src/App.vue` | 根组件（`<router-view />` 路由出口） |
| `src/style.css` | 全局样式定义 |
| `src/router/index.js` | 路由配置、嵌套路由、全局前置守卫 |
| `src/utils/request.js` | Axios 实例、请求/响应拦截器、Token 注入 |
| `src/utils/auth.js` | Token 与用户信息 localStorage 管理 |
| `src/api/` | API 接口封装层（对应后端接口 / Mock 接口） |
| `src/layouts/AdminLayout.vue` | 后台布局组件（侧边栏 + 顶栏 + 内容区） |
| `src/views/Login.vue` | 登录页面（账号密码登录、记住密码） |
| `mock/` | Mock 模拟数据目录（vite-plugin-mock） |
| `package.json` | 项目依赖配置与 npm 脚本 |
| `vite.config.js` | Vite 构建配置、Mock 插件、base 路径 |
| `.github/workflows/deploy.yml` | GitHub Actions CI/CD（自动部署到 GitHub Pages） |
| `Dockerfile` | 多阶段 Docker 构建（Node 编译 + Nginx 运行） |
| `nginx.conf` | Nginx 配置（Gzip、缓存、安全头、SPA 回退） |
| `docker-compose.yml` | Docker Compose 服务编排 |
| `deploy.sh` | 一键部署脚本（环境检查 + 容器启动） |

---

## 配置说明

### 环境变量

创建 `.env` 文件配置环境变量：

```env
# API 基础路径
VITE_API_BASE_URL=/api

# 部署路径
VITE_BASE_URL=/teaching-admin-vue/

# 开启 Mock
VITE_MOCK_ENABLE=true
```

### Vite 配置

查看 `vite.config.js` 文件：

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteMockServe } from 'vite-plugin-mock'

export default defineConfig({
  plugins: [
    vue(),
    viteMockServe({
      mockPath: 'mock',
      localEnabled: true,
      prodEnabled: true
    })
  ],
  base: '/teaching-admin-vue/'
})
```

### 路由配置

使用 Hash 模式适配 GitHub Pages：

```javascript
import { createRouter, createWebHashHistory } from 'vue-router'

const router = createRouter({
  history: createWebHashHistory('/teaching-admin-vue'),
  routes: [...]
})
```

---

## 部署指南

### 方式一：GitHub Pages 自动部署

项目已配置 GitHub Actions 自动部署，推送到 `main` 或 `master` 分支即可自动触发部署。

**部署流程：**

1. 确保项目已推送到 GitHub
2. 确保 GitHub Pages 配置在仓库 Settings 中启用
3. 推送代码到 `main` 分支
4. GitHub Actions 自动构建和部署
5. 访问部署地址

### 方式二：Docker 部署

项目已配置多阶段 Docker 构建，最终镜像仅包含 Nginx + 静态文件，体积小巧。

```bash
# 构建并启动（首次或代码更新后）
docker compose up -d --build

# 仅启动（已构建过镜像）
docker compose up -d

# 查看运行日志
docker compose logs -f

# 查看运行状态
docker compose ps

# 停止服务
docker compose down
```

访问：**http://localhost:8080**

> 📦 镜像基于 `nginx:1.27-alpine`，已配置 Gzip 压缩、静态资源长缓存、安全响应头。Dockerfile 内部会自动执行 `npx vite build --base /`，无需手动构建。

**单独使用 Docker（不使用 docker-compose）：**

```bash
# 构建镜像
docker build -t teaching-admin-vue .

# 运行容器（映射到 8080 端口）
docker run -d -p 8080:80 --name teaching-admin teaching-admin-vue

# 查看容器日志
docker logs -f teaching-admin

# 停止容器
docker stop teaching-admin

# 删除容器
docker rm teaching-admin

# 重新构建并运行（代码更新后）
docker stop teaching-admin && docker rm teaching-admin
docker build -t teaching-admin-vue .
docker run -d -p 8080:80 --name teaching-admin teaching-admin-vue
```

### 方式三：一键部署脚本

项目提供了 `deploy.sh` 一键部署脚本，自动检查环境、拉取代码、构建并启动 Docker 容器：

```bash
chmod +x deploy.sh
./deploy.sh
```

### 方式四：手动部署

1. 构建项目：

```bash
npm run build
```

2. 将 `dist` 目录部署到任意静态服务器（Nginx、Apache、Netlify、Vercel 等）

**Nginx 配置示例（nginx.conf）：**

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /usr/share/nginx/html;
    index index.html;

    # SPA 路由回退（Hash 模式也建议保留，防止直接访问子路径 404）
    location / {
        try_files $uri $uri/ /index.html;
    }

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;
}
```

---

## 使用指南

### 登录系统

1. 访问系统地址
2. 输入用户名和密码
3. 点击登录

默认测试账号：`teacher` / `123456`

### 题库管理

**创建题目：**

1. 进入题库管理页面
2. 点击"手动录入"按钮
3. 填写题目信息
4. 点击保存

**AI 出题：**

1. 点击"AI 智能出题"按钮
2. 选择课程和知识点
3. 设置生成数量
4. 点击"开始生成"

### 测试管理

**创建测试：**

1. 进入测试管理页面
2. 点击"创建测试"按钮
3. 填写测试信息并选择题目
4. 保存

**批改测试：**

1. 点击测试进入批改页面
2. 逐题手动批改或点击"AI 一键批改"
3. 查看批改结果

### 作业管理

**发布作业：**

1. 进入作业管理页面
2. 点击"发布作业"
3. 填写作业信息和截止时间
4. 保存

---

## API 文档

### 基础信息

| 属性 | 值 |
|------|-----|
| 基础路径 | `/api` |
| 认证方式 | Bearer Token |
| 数据格式 | JSON |

### 认证接口

#### 登录

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "teacher",
  "password": "123456"
}

Response:
{
  "code": 0,
  "message": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "teacher",
      "name": "教师"
    }
  }
}
```

### 业务接口

| 接口 | 方法 | 路径 | 说明 |
|------|------|------|------|
| 获取题目列表 | GET | `/api/questions` | 获取所有题目 |
| 创建题目 | POST | `/api/questions` | 创建新题目 |
| 更新题目 | PUT | `/api/questions/:id` | 更新指定题目 |
| 删除题目 | DELETE | `/api/questions/:id` | 删除指定题目 |
| AI 生成题目 | POST | `/api/questions/ai-generate` | AI 智能出题 |
| 获取测试列表 | GET | `/api/tests` | 获取所有测试 |
| 创建测试 | POST | `/api/tests` | 创建新测试 |
| AI 批改测试 | POST | `/api/tests/:id/ai-grade` | AI 自动批改 |



---

## 开发指南

### 开发规范

#### 代码规范

- 使用 Vue 3 Composition API
- 使用 ESLint 进行代码检查
- 使用 Prettier 进行代码格式化
- 组件文件使用 PascalCase 命名
- 使用 `<style scoped>` 限制样式作用域

#### Git 提交规范

```
<type>(<scope>): <subject>

类型说明：
- feat: 新功能
- fix: Bug 修复
- docs: 文档更新
- style: 代码格式调整
- refactor: 代码重构
- perf: 性能优化
- test: 测试相关
- chore: 构建/工具链相关
```

示例：

```bash
git commit -m "feat(questions): 添加 AI 智能出题功能"
```

### 新增功能模块

1. 在 `mock/` 目录下创建 Mock 接口
2. 在 `src/api/` 目录下创建 API 封装
3. 在 `src/views/` 目录下创建页面组件
4. 在 `src/router/index.js` 中配置路由
5. 在 `src/layouts/AdminLayout.vue` 中添加菜单项

### 调试技巧

- 使用 Vue DevTools 调试组件
- 使用浏览器开发者工具调试
- 查看 Network 面板分析请求
- 使用 Console 输出调试信息

---

## 贡献规范

我们欢迎和感谢任何形式的贡献！

### 贡献流程

1. **Fork 仓库** - 点击仓库右上角的 Fork 按钮
2. **克隆仓库** - `git clone https://github.com/your-username/teaching-admin-vue.git`
3. **创建分支** - `git checkout -b feature/your-feature-name`
4. **开发修改** - 进行代码修改
5. **提交代码** - `git commit -m "feat: 描述你的修改"`
6. **推送代码** - `git push origin feature/your-feature-name`
7. **创建 Pull Request** - 在 GitHub 上创建 PR

### Pull Request 规范

- PR 标题清晰描述修改内容
- 详细描述 PR 的目的和变更
- 确保所有测试通过
- 包含必要的文档更新
- 代码风格符合项目规范

### 代码审查

所有 PR 都需要经过代码审查，审查重点：

- 功能是否完整
- 代码质量是否达标
- 测试是否充分
- 文档是否完善

---

## 版本历史

### v1.0.0 (2025-06-01)

**✨ 新增功能：**

- 题库管理模块（CRUD、多维筛选、AI 出题）
- 测试管理模块（选题组卷、逐题批改、AI 一键批改）
- 作业管理模块（发布作业、截止时间、状态筛选）
- 考勤管理模块（考勤记录、统计面板、签到码生成）
- 课程管理模块（卡片展示、批量删除、加课码复制）
- 学生管理模块（列表/分页/搜索/CRUD）
- 个人中心（信息编辑、密码修改、表单验证）
- 用户认证系统（登录/登出、路由守卫、Token 管理）

**🎨 UI/UX 优化：**

- Element Plus 全面集成（中文语言包）
- 响应式侧边栏布局（折叠/展开、小屏适配）
- 骨架屏、空状态、二次确认等交互细节
- 统一渐变色系（`#667eea` → `#764ba2`）

**🔧 技术实现：**

- Vue 3 Composition API（`<script setup>`）
- Vite 8.x 构建工具
- Vue Router 4.x Hash 模式 + 路由守卫
- Axios 请求/响应拦截器封装
- vite-plugin-mock 数据模拟
- GitHub Pages + GitHub Actions CI/CD
- Docker 多阶段构建 + Nginx 部署
- 一键部署脚本 `deploy.sh`

完整的更新日志请查看：[Releases](https://github.com/codezzj/teaching-admin-vue/releases)

---

## 常见问题

### 开发相关

**Q: npm install 很慢或报错？**

A: 使用国内镜像源：
```bash
npm install --registry=https://registry.npmmirror.com
```

**Q: 开发服务器端口被占用（如 5173 已被使用）？**

A: Vite 会自动递增端口号（5173 → 5174 → 5175），请以终端实际输出为准。也可以手动指定端口：
```bash
npx vite --port 3000
```

**Q: 访问 localhost:5173 显示 404？**

A: 项目配置了 `base: '/teaching-admin-vue/'`，请访问完整路径：
```
http://localhost:5173/teaching-admin-vue/
```
端口号以终端输出为准（可能是 5174 或其他）。

**Q: 开发时如何清除登录状态重新看到登录页？**

A: 打开浏览器开发者工具（F12），进入 **Application** → **Local Storage**，删除 `token` 和 `user` 两个 key，刷新页面即可。

**Q: 换一台新电脑需要重新登录吗？**

A: 是的。登录信息（token）保存在浏览器本地存储（localStorage）中，更换电脑或浏览器都需要重新登录。

**Q: 如何切换 Mock 数据和真实后端 API？**

A: 修改 `vite.config.js` 中 `viteMockServe` 的 `localEnabled` 为 `false` 即可关闭 Mock。同时需要在 `.env` 文件中配置真实的 `VITE_API_BASE_URL`。

**Q: Mock 数据不生效？**

A: 检查 `vite.config.js` 中的 viteMockServe 配置，确保 `localEnabled` 和 `prodEnabled` 为 true。Mock 文件位于项目根目录的 `mock/` 文件夹下。

### 部署相关

**Q: GitHub Pages 刷新后 404？**

A: 本项目使用 Hash 路由模式（URL 带 `#`），不会出现此问题。

**Q: Docker 部署后静态资源 404？**

A: Docker 构建时已使用 `npx vite build --base /` 覆盖默认的 `/teaching-admin-vue/` 路径。如果手动构建请确保添加 `--base /` 参数。

**Q: Docker 容器端口冲突（8080 已被占用）？**

A: 修改端口映射，将宿主机端口改为其他值：
```bash
# docker-compose 方式：修改 docker-compose.yml 中 ports 配置
# Docker 方式：修改 -p 参数
docker run -d -p 9090:80 --name teaching-admin teaching-admin-vue
```

**Q: 构建后空白页？**

A: 检查部署环境的 base 路径是否匹配：GitHub Pages 使用 `/teaching-admin-vue/`，Docker/Nginx 使用 `/`。可在 `vite.config.js` 中修改 `base` 配置。

**Q: 如何在同一台服务器部署多个 Vite 项目？**

A: 修改每个项目的 `vite.config.js` 中的 `base` 路径和 Nginx 的 `location` 配置，确保路径不冲突。

### 功能相关

**Q: AI 功能是真实的吗？**

A: 当前版本为模拟实现，生产环境可对接真实的 AI 服务。

**Q: 数据持久化？**

A: 当前 Mock 数据存储在内存中，后续版本将连接真实后端。

更多问题请查看：[Wiki 常见问题](https://github.com/codezzj/teaching-admin-vue/wiki/FAQ)

---

## 许可证

本项目采用 [MIT 许可证](https://opensource.org/licenses/MIT) 开源。

**MIT License - 您可以：**

- ✅ 商业使用
- ✅ 修改
- ✅ 分发
- ✅ 私有使用

**您需要：**

- 包含许可证文件和版权声明

详见：[LICENSE](https://github.com/codezzj/teaching-admin-vue/blob/master/LICENSE)

---

## 联系方式

### 项目维护者

| 姓名 | 邮箱 | GitHub |
|------|------|--------|
| 项目维护者 | 2325182440@qq.com | [@codezzj](https://github.com/codezzj) |

### 相关链接

- **项目主页**: [https://github.com/codezzj/teaching-admin-vue](https://github.com/codezzj/teaching-admin-vue)
- **在线演示**: [https://codezzj.github.io/teaching-admin-vue/login](https://codezzj.github.io/teaching-admin-vue/login)
- **问题反馈**: [GitHub Issues](https://github.com/codezzj/teaching-admin-vue/issues)
- **功能建议**: [Discussions](https://github.com/codezzj/teaching-admin-vue/discussions)
- **Wiki 文档**: [GitHub Wiki](https://github.com/codezzj/teaching-admin-vue/wiki)

### 社区交流

欢迎加入我们的社区，分享经验、交流想法！

---

## 致谢

感谢所有为本项目做出贡献的开发者！

特别感谢以下开源项目：

- [Vue.js](https://vuejs.org/) - 渐进式 JavaScript 框架
- [Vite](https://vitejs.dev/) - 下一代前端构建工具
- [Element Plus](https://element-plus.org/) - Vue 3 组件库
- [Axios](https://axios-http.com/) - HTTP 客户端

---

## 附录

### 测试账号

| 角色 | 用户名 | 密码 | 说明 |
|------|--------|------|------|
| 教师 | `teacher` | `123456` | 系统测试账号 |

### 快速命令参考

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# Docker 部署
docker-compose up -d
```

---

**Made with ❤️ by codezzj**

---

**最后更新时间**: 2025-06-01

