# 此处为环境变量配置文件夹

## SQLite 配置

服务端数据库已切换为 SQLite，TypeORM 驱动使用 `better-sqlite3`。

可选环境变量：

```env
DATABASE_PATH=db.sqlite
```

说明：

- `DATABASE_PATH` 可写相对路径或绝对路径。
- 未配置时默认使用启动目录下的 `db.sqlite`。
- `TYPEORM_SYNCHRONIZE=true/false` 可显式控制是否启用自动同步；未设置时仅 `NODE_ENV=development` 自动开启。

## TypeORM Migrations

开发环境：

```bash
pnpm -C server migration:show
pnpm -C server migration:generate -- ./src/db/migrations/add-something
pnpm -C server migration:run
pnpm -C server migration:revert
```

生产环境推荐流程：

```bash
pnpm -C server build
NODE_ENV=production TYPEORM_SYNCHRONIZE=false pnpm -C server migration:run:prod
```

说明：

- 开发环境可保留自动同步，便于快速迭代。
- 线上环境应关闭 `synchronize`，改用 `migration:run:prod` 更新数据库结构。
- `server/src/db/data-source.ts` 是 TypeORM CLI 的统一入口。

## MySQL -> SQLite 迁移脚本

迁移命令：

```bash
pnpm -C server migrate:mysql-to-sqlite -- --force
```

迁移脚本需要以下环境变量：

```env
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_USER=your_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=your_database
DATABASE_PATH=db.sqlite
```

可选参数：

- `--force`: 允许覆盖已存在的 SQLite 文件并重建表结构
- `--batch <N>`: 分批迁移大小，默认 `500`
- `--only a,b,c`: 只迁移指定表
- `--skip a,b,c`: 跳过指定表

说明：

- 迁移脚本使用 TypeORM 同时连接 MySQL 和 SQLite（`better-sqlite3`）
- 默认会拒绝覆盖已存在且非空的 SQLite 文件，避免误删数据
- 表名匹配使用 TypeORM metadata 中的 `tableName`
