#!/bin/bash

# 智能教学辅助管理系统 - 一键部署脚本

set -e

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info()    { echo -e "${BLUE}[INFO]${NC} $1"; }
log_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
log_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
log_error()   { echo -e "${RED}[ERROR]${NC} $1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

# 获取可用的 Docker Compose 命令（优先 v2）
get_dc_cmd() {
    if docker compose version >/dev/null 2>&1; then
        echo "docker compose"
    elif command_exists docker-compose; then
        echo "docker-compose"
    else
        echo ""
    fi
}

check_environment() {
    log_info "检查部署环境..."

    if command_exists git; then
        log_success "Git 已安装: $(git --version | head -1)"
    else
        log_error "Git 未安装，请先安装 Git"
        exit 1
    fi

    if command_exists docker; then
        log_success "Docker 已安装: $(docker --version)"
    else
        log_error "Docker 未安装，请先安装 Docker"
        exit 1
    fi

    DC_CMD=$(get_dc_cmd)
    if [ -z "$DC_CMD" ]; then
        log_error "Docker Compose 未安装，请先安装 Docker Compose"
        exit 1
    fi
    log_success "Docker Compose 可用: $DC_CMD"
}

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

deploy_docker() {
    log_info "构建并启动 Docker 容器..."

    DC_CMD=$(get_dc_cmd)

    if [ -f "docker-compose.yml" ]; then
        $DC_CMD down
    fi

    # 构建并启动（Dockerfile 内部已完成 npm ci 和 npm run build）
    $DC_CMD up -d --build

    log_success "Docker 容器启动成功！"
    log_info "访问地址: http://localhost:8080"
}

show_status() {
    DC_CMD=$(get_dc_cmd)

    log_info "部署状态检查..."
    echo ""
    echo "=========================================="
    echo "服务状态"
    echo "=========================================="
    $DC_CMD ps
    echo ""
    echo "=========================================="
    echo "最近日志"
    echo "=========================================="
    $DC_CMD logs --tail=20
}

main() {
    echo ""
    echo "=========================================="
    echo "  智能教学辅助管理系统 - 一键部署脚本"
    echo "=========================================="
    echo ""

    check_environment

    read -p "是否更新代码？(y/n): " update_choice
    if [ "$update_choice" = "y" ] || [ "$update_choice" = "Y" ]; then
        update_code
    fi

    deploy_docker
    show_status

    log_success "部署完成！"
    log_info "查看完整日志请运行: $DC_CMD logs -f"
}

main "$@"
