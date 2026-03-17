/* eslint-disable no-console */
import 'reflect-metadata';

import { mkdirSync, statSync } from 'node:fs';
import { dirname, isAbsolute, resolve } from 'node:path';
import process from 'node:process';
import { DataSource, type EntityTarget, type ObjectLiteral } from 'typeorm';

import { SERVER_ENTITIES } from '@/db/entities';

type Args = {
  batchSize: number;
  force: boolean;
  only?: Set<string>;
  skip?: Set<string>;
  mysql: {
    host: string;
    port: number;
    username: string;
    password: string;
    database: string;
  };
  sqlitePath: string;
};

function parseList(value: string | undefined): Set<string> | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? new Set(items) : undefined;
}

function parseArgs(argv: string[]): Args {
  if (argv.includes('--help') || argv.includes('-h')) {
    printHelp();
    process.exit(0);
  }

  const env = process.env;

  const get = (name: string, fallback?: string): string => {
    const v = env[name] ?? fallback;
    if (!v) throw new Error(`缺少环境变量: ${name}`);
    return v;
  };

  const mysqlHost = get('MYSQL_HOST', '127.0.0.1');
  const mysqlPort = Number(env.MYSQL_PORT ?? '3306');
  const mysqlUser = get('MYSQL_USER');
  const mysqlPass = env.MYSQL_PASSWORD ?? '';
  const mysqlDb = get('MYSQL_DATABASE');

  const configuredPath = env.DATABASE_PATH || 'db.sqlite';
  const sqlitePath = isAbsolute(configuredPath) ? configuredPath : resolve(process.cwd(), configuredPath);

  let batchSize = Number(env.MIGRATE_BATCH_SIZE ?? '500');
  let force = false;
  let only = parseList(env.MIGRATE_ONLY);
  let skip = parseList(env.MIGRATE_SKIP);

  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--') continue; // pnpm run may forward an extra `--`
    if (a === '--force') {
      force = true;
      continue;
    }
    if (a === '--batch' || a === '--batchSize') {
      const next = argv[i + 1];
      if (!next) throw new Error('缺少参数: --batch');
      batchSize = Number(next);
      i++;
      continue;
    }
    if (a === '--only') {
      const next = argv[i + 1];
      if (!next) throw new Error('缺少参数: --only');
      only = parseList(next);
      i++;
      continue;
    }
    if (a === '--skip') {
      const next = argv[i + 1];
      if (!next) throw new Error('缺少参数: --skip');
      skip = parseList(next);
      i++;
      continue;
    }
    throw new Error(`未知参数: ${a}`);
  }

  if (!Number.isFinite(batchSize) || batchSize <= 0) batchSize = 500;

  return {
    batchSize,
    force,
    only,
    skip,
    mysql: {
      host: mysqlHost,
      port: Number.isFinite(mysqlPort) && mysqlPort > 0 ? mysqlPort : 3306,
      username: mysqlUser,
      password: mysqlPass,
      database: mysqlDb,
    },
    sqlitePath,
  };
}

function printHelp() {
  console.log(`
MySQL -> SQLite 迁移脚本（TypeORM）

用法:
  pnpm -C server migrate:mysql-to-sqlite -- [options]

必须环境变量:
  MYSQL_USER=...
  MYSQL_DATABASE=...

可选环境变量:
  MYSQL_HOST=127.0.0.1
  MYSQL_PORT=3306
  MYSQL_PASSWORD=...
  DATABASE_PATH=db.sqlite
  MIGRATE_BATCH_SIZE=500
  MIGRATE_ONLY=tableA,tableB   (实体表名，按 TypeORM metadata.tableName 匹配)
  MIGRATE_SKIP=tableC,tableD

options:
  --force              允许覆盖目标 SQLite（会 drop+sync）
  --batch <N>          每批导入数量（默认 500）
  --only a,b,c         只迁移指定表
  --skip a,b,c         跳过指定表
  -h, --help           打印帮助
`);
}

function ensureDir(path: string) {
  mkdirSync(dirname(path), { recursive: true });
}

function fileExistsNonEmpty(path: string): boolean {
  try {
    const st = statSync(path);
    return st.isFile() && st.size > 0;
  } catch {
    return false;
  }
}

function shouldMigrateTable(args: Args, tableName: string): boolean {
  if (args.only && !args.only.has(tableName)) return false;
  if (args.skip && args.skip.has(tableName)) return false;
  return true;
}

async function migrateEntity(args: Args, source: DataSource, target: DataSource, entity: EntityTarget<ObjectLiteral>) {
  const meta = source.getMetadata(entity);
  const tableName = meta.tableName;
  if (!shouldMigrateTable(args, tableName)) {
    console.log(`[skip] ${tableName}`);
    return { tableName, copied: 0, skipped: true };
  }

  const primary = meta.primaryColumns[0];
  if (!primary) {
    console.log(`[skip] ${tableName} (no primary key)`);
    return { tableName, copied: 0, skipped: true };
  }

  const pk = primary.propertyName;
  const sourceRepo = source.getRepository(entity);
  const targetRepo = target.getRepository(entity);

  console.log(`[start] ${tableName} pk=${pk} batch=${args.batchSize}`);

  let copied = 0;
  // Keyset pagination: requires PK to be comparable with ">".
  let lastPk: unknown = null;

  while (true) {
    const qb = sourceRepo.createQueryBuilder('t').orderBy(`t.${pk}`, 'ASC').take(args.batchSize);
    if (lastPk !== null) qb.where(`t.${pk} > :lastPk`, { lastPk });

    const rows = await qb.getMany();
    if (!rows.length) break;

    // Target is expected to be empty or freshly synchronized in --force mode.
    await targetRepo.save(rows, { chunk: Math.min(args.batchSize, 200) });

    copied += rows.length;
    lastPk = (rows[rows.length - 1] as any)[pk];
    if (copied % (args.batchSize * 10) === 0) {
      console.log(`[progress] ${tableName} copied=${copied}`);
    }
  }

  console.log(`[done] ${tableName} copied=${copied}`);
  return { tableName, copied, skipped: false };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  ensureDir(args.sqlitePath);

  if (fileExistsNonEmpty(args.sqlitePath) && !args.force) {
    throw new Error(`目标 SQLite 已存在且非空: ${args.sqlitePath}。如需覆盖请加 --force。`);
  }

  const source = new DataSource({
    type: 'mysql',
    host: args.mysql.host,
    port: args.mysql.port,
    username: args.mysql.username,
    password: args.mysql.password,
    database: args.mysql.database,
    entities: [...SERVER_ENTITIES],
    synchronize: false,
    timezone: 'Z',
  } as any);

  const target = new DataSource({
    type: 'better-sqlite3',
    database: args.sqlitePath,
    entities: [...SERVER_ENTITIES],
    synchronize: false,
  } as any);

  console.log(`[init] mysql=${args.mysql.username}@${args.mysql.host}:${args.mysql.port}/${args.mysql.database}`);
  console.log(`[init] sqlite=${args.sqlitePath} force=${args.force}`);

  await source.initialize();
  await target.initialize();

  if (args.force) {
    console.log('[sync] drop+sync target schema');
    await target.synchronize(true);
  } else {
    console.log('[sync] sync target schema');
    await target.synchronize(false);
  }

  // Avoid FK order constraints during raw data copy.
  await target.query('PRAGMA foreign_keys = OFF');

  const results: Array<{ tableName: string; copied: number; skipped: boolean }> = [];
  for (const entity of SERVER_ENTITIES) {
    // eslint-disable-next-line no-await-in-loop
    results.push(await migrateEntity(args, source, target, entity));
  }

  await target.query('PRAGMA foreign_keys = ON');

  const copiedTotal = results.reduce((sum, r) => sum + r.copied, 0);
  const skippedTotal = results.filter((r) => r.skipped).length;
  console.log(`[summary] copied=${copiedTotal} tables=${results.length} skipped=${skippedTotal}`);

  await source.destroy();
  await target.destroy();
}

main().catch((err) => {
  console.error(`[error] ${err instanceof Error ? err.message : String(err)}`);
  if (err instanceof Error && err.stack) console.error(err.stack);
  process.exitCode = 1;
});
