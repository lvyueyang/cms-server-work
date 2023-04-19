# 内容管理系统前后端工程

# 服务端

基于 nest.js 构建

## 环境变量

查看 `packages/server/.default.env`

## 文件资源保存目录说明

### 资源保存目录

默认配置

```conf
FILE_DATA_DIR_PATH="~/node_server_data/cms_server"
```

修改保存位置时直接修改环境变量即可

### 日志与上传文件目录

基于 `FILE_DATA_DIR_PATH`
日志文件存储于 logs 目录下
用户上传资源存储于 uploadfile 目录下

## docker 相关

1. 未避免日志与上传资源文件在发布镜像时被覆盖，启动时需配置 volume  
   `docker run -v static:/root/node_server_data {imageName}`

## 初始化

首次启动需创建超级管理员账户
需主动打开 `/_cms_admin/_init_root_user` 页面进行超管初始化

# CMS UI 管理后台

umi 构建 React + antd + antd Pro + typescript
