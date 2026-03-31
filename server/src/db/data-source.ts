import "reflect-metadata";

import { join } from "node:path";
import { DataSource } from "typeorm";

import {
	createSqliteDataSourceOptions,
	isDevSynchronizeEnabled,
} from "./sqlite-options";

const migrationExt = __filename.endsWith(".ts") ? "ts" : "js";
const migrationsGlob = join(__dirname, "migrations", `*.${migrationExt}`);
const synchronize = isDevSynchronizeEnabled(
	process.env.NODE_ENV,
	process.env.TYPEORM_SYNCHRONIZE,
);

export default new DataSource({
	...createSqliteDataSourceOptions({
		databasePath: process.env.DATABASE_PATH,
		synchronize,
		migrations: [migrationsGlob],
	}),
	migrationsRun: false,
});
