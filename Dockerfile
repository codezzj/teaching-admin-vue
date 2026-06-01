# ============================================================
# 第一阶段：构建 Vue 应用
# 使用 node:20-alpine 轻量镜像，仅用于编译，不进入最终镜像
# ============================================================
FROM node:20.18-alpine AS builder

WORKDIR /app

# 先复制 package 文件，利用 Docker 缓存层加速重复构建
COPY package*.json ./

# ci 比 install 更快更可靠
# 如需国内加速可取消注释 registry 参数
RUN npm ci
# RUN npm ci --registry=https://registry.npmmirror.com

# 复制全部源码（.dockerignore 已排除不必需文件）
COPY . .

# Vite 生产构建
# --base=/ 确保 Docker 部署时静态资源从根路径加载（与 GitHub Pages 的 /teaching-admin-vue/ 不同）
RUN npx vite build --base /

# ============================================================
# 第二阶段：Nginx 运行环境（最终镜像，仅包含静态文件）
# ============================================================
FROM nginx:1.27-alpine

LABEL maintainer="codezzj"
LABEL description="智能教学辅助管理系统 - 教师端"

# 安装 curl 用于健康检查，安装后清理包索引
RUN apk add --no-cache curl && \
    rm -rf /var/cache/apk/*

# 从构建阶段复制 dist 产物到 Nginx 默认目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 使用自定义 Nginx 配置（支持 History 路由、Gzip、安全头）
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露 HTTP 端口
EXPOSE 80

# 容器健康检查：每 30 秒探测首页是否可访问
HEALTHCHECK --interval=30s --timeout=3s --retries=3 --start-period=10s \
  CMD curl -f http://localhost/ || exit 1

# 前台运行 Nginx（容器内不能后台运行）
CMD ["nginx", "-g", "daemon off;"]
