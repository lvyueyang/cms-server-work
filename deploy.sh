#!/bin/bash

# 遇到错误立即退出
set -e

# 检查是否提供了镜像名称参数
if [ -z "$1" ]; then
    echo "Usage: $0 <image_name>"
    exit 1
fi

IMAGE_NAME=$1
CONTAINER_NAME="xxx"

echo "Starting deployment for image: $IMAGE_NAME"

# 拉取最新镜像
echo "Pulling image..."
docker pull "$IMAGE_NAME"

# 停止监控服务 (如果存在)
echo "Stopping check-docker.service..."
systemctl stop check-docker.service || echo "check-docker.service could not be stopped or does not exist."

# 停止并删除旧容器 (如果存在)
echo "Stopping and removing old container..."
if [ "$(docker ps -aq -f name=^/${CONTAINER_NAME}$)" ]; then
    docker stop "$CONTAINER_NAME"
    docker rm "$CONTAINER_NAME"
else
    echo "Container $CONTAINER_NAME does not exist."
fi

# 启动新容器
# 添加了 -d (后台运行) 和 --restart unless-stopped (自动重启)
echo "Starting new container..."
docker run -d \
    --restart unless-stopped \
    -v /root/xxx/data:/root/node_server_data \
    -v /root/xxx/config:/app/server/env \
    -p 7001:7001 \
    --name "$CONTAINER_NAME" \
    "$IMAGE_NAME"

# 启动监控服务
echo "Starting check-docker.service..."
systemctl start check-docker.service || echo "Failed to start check-docker.service"

echo "Deployment completed successfully!"
