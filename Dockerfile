FROM node:20-alpine AS build

# 设置 CI 环境变量，避免 pnpm install 交互式确认
ENV CI=true

WORKDIR /app

COPY . /app

# 安装 pnpm
RUN npm i -g pnpm --registry=https://registry.npmmirror.com

# 配置 pnpm store
RUN pnpm config set store-dir /pnpm/store

# 安装依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --registry=https://registry.npmmirror.com
# 打包 admin-ui
RUN npm run build:admin
# 打包 前端页面
RUN npm run build:fe
# 打包 server
RUN npm run build:server

# 生产环境镜像
FROM node:20-alpine

ENV CI=true

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY ./work.config.json /app/work.config.json
COPY ./.npmrc /app/.npmrc

COPY --from=build /app/server /app/server
COPY ./local_packages /app/local_packages

# 安装 pnpm
RUN npm i -g pnpm --registry=https://registry.npmmirror.com
RUN pnpm config set store-dir /pnpm/store

# 安装生产依赖
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile --registry=https://registry.npmmirror.com

# 不需要 src 下源码了
RUN rm -rf /app/server/src
RUN rm -rf /app/clients
RUN rm -rf /app/packages

ENV TZ="Asia/Shanghai"

EXPOSE 7001

# 启动
CMD ["npm", "run", "start:prod"]
