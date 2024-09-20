FROM node:20-alpine AS build

WORKDIR /app

COPY . /app

# 安装 pnpm
RUN npm i -g pnpm --registry=https://registry.npmmirror.com

# 安装依赖
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm install --frozen-lockfile
# 打包 cms-ui
RUN npm run build:cms
# 打包 前端页面
RUN npm run build:fe
# 打包 server
RUN npm run build:server


FROM node:20-alpine

WORKDIR /app

COPY ./package.json /app/package.json
COPY ./pnpm-lock.yaml /app/pnpm-lock.yaml
COPY ./pnpm-workspace.yaml /app/pnpm-workspace.yaml
COPY ./work.config.json /app/work.config.json
COPY ./.npmrc /app/.npmrc
COPY ./clients/fe /app/clients/fe

COPY --from=build /app/server /app/server

# 安装 pnpm
RUN npm i -g pnpm --registry=https://registry.npmmirror.com

# 安装生产依赖
# RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
RUN pnpm install --prod --frozen-lockfile

# 不需要 src 下源码了
RUN rm -rf /app/server/src
RUN rm -rf /app/clients/fe/src

ENV TZ="Asia/Shanghai"

EXPOSE 7000

# 启动
CMD ["npm", "run", "start:prod"]
