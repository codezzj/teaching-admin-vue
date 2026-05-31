#!/bin/bash

# 智能教学辅助管理系统 - 一键部署脚本
# Copyright (c) 2026 智能教学辅助管理系统

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 日志函数
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查命令是否存在
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# 检查环境检查
check_environment() {
    log_info "检查部署环境..."

    # 检查 Git
    if command_exists git; then
        log_success "Git 已安装: $(git --version)"
    else
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi

    # 检查 Docker
    if command_exists docker; then
        log_success "Docker 已安装: $(docker --version)"
    else
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    # 检查 Docker Compose
    if command_exists docker-compose; then
        log_success "Docker Compose 已安装: $(docker-compose --version)"
    else
        log_warning "Docker Compose 未找到，尝试使用 docker compose plugin..."
        if docker compose version >/dev/null 2>&1; then
            log_success "Docker Compose Plugin 已找到"
        else
            log_error "Docker Compose 未安装，请先安装 Docker Compose"
            exit 1
        fi
    fi
}

# 更新代码
update_code() {
    log_info "更新代码..."

    if [ -d ".git" ]; then
        git fetch origin
        git pull origin main || git pull origin master
        log_success "代码更新完成"
    else
        log_warning "当前目录不是 Git 仓库，跳过代码更新"
    fi
}

# 安装依赖
install_dependencies() {
    log_info "安装依赖..."

    if [ -f "package.json" ]; then
        npm ci --registry=https://registry.npmmirror.com
        log_success "依赖安装完成"
    else
        log_warning "未找到 package.json，跳过依赖安装"
    fi
}

# 构建并启动容器
deploy_docker() {
    log_info "构建并启动 Docker 容器..."

    # 停止旧容器
    if [ -f "docker-compose.yml" ]; then
        docker-compose down
    fi

    # 构建并启动
    docker-compose up -d --build

    log_success "Docker 容器启动成功！"
    log_info "访问地址: http://localhost:8080"
}

# 显示部署状态
show_status() {
    log_info "部署状态检查..."
    echo ""
    echo "=========================================="
    echo "服务状态"
    echo "=========================================="
    docker-compose ps
    echo ""
    echo "=========================================="
    echo "最近日志"
    echo "=========================================="
    docker-compose logs --tail=20
}

# 主函数
main() {
    echo ""
    echo "=========================================="
    echo "  智能教学辅助管理系统 - 一键部署脚本"
    echo "  Copyright (c) 2026"
    echo "=========================================="
    echo ""

    # 检查环境
    check_environment

    # 询问是否更新代码
    read -p "是否更新代码？(y/n): " update_code_choice
    if [ "$update_code_choice" = "y" ] || [ "$update_code_choice" = "Y" ]; then
        update_code
    fi

    # 询问是否安装依赖
    read -p "是否安装/更新依赖？(y/n): " install_deps_choice
    if [ "$install_deps_choice" = "y" ] || [ "$install_deps_choice" = "Y" ]; then
        install_dependencies
    fi

    # 开始部署
    deploy_docker

    # 显示状态
    show_status

    log_success "部署完成！"
    log_info "查看完整日志请运行: docker-compose logs -f"
}

# 运行主函数
main "$@"
