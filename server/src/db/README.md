# DB Migrations

本目录放置 `server` 的 TypeORM SQLite 数据库配置与 migration 入口。

## 文件说明

- `entities.ts`
  - 服务端实体清单的单一来源，运行时配置与迁移脚本共用
- `sqlite-options.ts`
  - SQLite/`better-sqlite3` 的共享 TypeORM 配置工厂
- `data-source.ts`
  - TypeORM CLI 的统一入口，供 `migration:*` 命令使用
- `migrations/`
  - 存放 migration 文件

## 运行规则

- 开发环境默认开启 `synchronize`
- 生产环境默认关闭 `synchronize`
- 线上更新数据库结构必须使用 migration

可通过以下环境变量控制：

```env
NODE_ENV=development
DATABASE_PATH=db.sqlite
TYPEORM_SYNCHRONIZE=true
```

说明：

- `TYPEORM_SYNCHRONIZE=true/false` 优先级高于 `NODE_ENV`
- 未设置 `TYPEORM_SYNCHRONIZE` 时，仅 `NODE_ENV=development` 默认开启同步

## 常用命令

开发环境查看当前 migration：

```bash
pnpm -C server migration:show
```

生成新的 migration：

```bash
pnpm -C server migration:generate -- ./src/db/migrations/<migration-name>
```

执行 migration：

```bash
pnpm -C server migration:run
```

回滚最近一次 migration：

```bash
pnpm -C server migration:revert
```

生产环境执行 migration：

```bash
NODE_ENV=production TYPEORM_SYNCHRONIZE=false pnpm -C server build
NODE_ENV=production TYPEORM_SYNCHRONIZE=false pnpm -C server migration:run:prod
```

## 推荐流程

1. 开发时修改实体
2. 本地生成 migration
3. 本地执行 `migration:run` 验证
4. 提交实体变更和 migration 文件
5. 线上部署后执行 `migration:run:prod`

## 注意事项

- 不要在生产环境依赖 `synchronize`
- 每次结构变更都应提交 migration 文件
- 迁移前建议先备份现有 SQLite 文件
