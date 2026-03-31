import { mkdirSync } from "node:fs";
import { dirname, isAbsolute, resolve } from "node:path";
import { type TypeOrmModuleOptions } from "@nestjs/typeorm";
import type { DataSourceOptions } from "typeorm";

import { SERVER_ENTITIES } from "./entities";

/**
 * 解析 SQLite 数据库文件路径，并在 TypeORM/better-sqlite3 尝试打开文件前
 * 确保父目录已创建（避免因目录不存在导致启动/迁移失败）。
 */
export function resolveDatabasePath(configuredPath?: string): string {
	const rawPath = configuredPath || "db.sqlite";
	const sqlitePath = isAbsolute(rawPath)
		? rawPath
		: resolve(process.cwd(), rawPath);
	mkdirSync(dirname(sqlitePath), { recursive: true });
	return sqlitePath;
}

/**
 * 支持显式环境变量覆盖，同时保持默认行为简单：
 * 未设置 `TYPEORM_SYNCHRONIZE` 时，仅在 `development` 环境启用 `synchronize`。
 */
export function isDevSynchronizeEnabled(
	nodeEnv?: string,
	explicitFlag?: string,
): boolean {
	if (explicitFlag === "true") return true;
	if (explicitFlag === "false") return false;
	return (nodeEnv || "development") === "development";
}

/**
 * Nest 运行时（TypeOrmModule）使用的配置。
 * `migrations` 默认指向编译产物（`dist/.../*.js`），因为生产运行通常加载的是 dist。
 */
export function createSqliteNestOptions(params: {
	databasePath?: string;
	synchronize?: boolean;
}): TypeOrmModuleOptions {
	return {
		type: "better-sqlite3",
		retryAttempts: 3,
		database: resolveDatabasePath(params.databasePath),
		entities: [...SERVER_ENTITIES],
		migrations: ["dist/src/db/migrations/*.js"],
		migrationsTableName: "typeorm_migrations",
		synchronize: params.synchronize ?? false,
	};
}

/**
 * TypeORM CLI/独立 DataSource 使用的配置。
 * `migrations` 的 glob 由调用方传入，以便兼容 `.ts`（开发）与 `.js`（生产）两种入口。
 */
export function createSqliteDataSourceOptions(params: {
	databasePath?: string;
	synchronize?: boolean;
	migrations: string[];
}): DataSourceOptions {
	return {
		type: "better-sqlite3",
		database: resolveDatabasePath(params.databasePath),
		entities: [...SERVER_ENTITIES],
		migrations: params.migrations,
		migrationsTableName: "typeorm_migrations",
		synchronize: params.synchronize ?? false,
	} satisfies DataSourceOptions;
}
