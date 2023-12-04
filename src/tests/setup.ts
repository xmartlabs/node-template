import RedisMock from 'ioredis-mock';
import { PrismaClient } from '@prisma/client';
import spawn from 'cross-spawn';
import path from 'path';
import { buildUniquePgSchemaName } from './utils/unique-schema';

jest.mock('ioredis', () => RedisMock);
interface QueryResult {
  tablename: string;
}

const prismaBinary = path.join(process.cwd(), 'node_modules', '.bin', 'prisma');

const uniqueSchemaName = buildUniquePgSchemaName();

const dbName = process.env.DATABASE_URL?.split('?schema=')[0];

const dbUrl = `${dbName}?schema=${uniqueSchemaName}`;

// Need to set the new value back on `process.env` such that:
// - `spawn` calls to use this as well.
process.env.DATABASE_URL = dbUrl;

const db = new PrismaClient({
  datasources: {
    db: {
      url: dbUrl,
    },
  },
});

let tableNames: string[];

beforeAll(async () => {
  await db.$connect();

  spawn.sync(
    prismaBinary,
    ['db', 'push', '--accept-data-loss', '--skip-generate'],
    {
      env: process.env,
    },
  );

  const tables: Array<QueryResult> = await db.$queryRawUnsafe<
    Array<QueryResult>
  >(`SELECT tablename FROM pg_tables WHERE schemaname='${uniqueSchemaName}'`);

  tableNames = tables
    .filter(({ tablename }) => tablename !== '_prisma_migrations')
    .map(({ tablename }) => `"${uniqueSchemaName}"."${tablename}"`);
});

afterEach(async () => {
  await db.$executeRawUnsafe(
    `TRUNCATE TABLE ${tableNames.join(', ')} CASCADE;`,
  );
});

afterAll(async () => {
  await db.$disconnect();
});
