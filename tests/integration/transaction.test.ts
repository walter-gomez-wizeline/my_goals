import { loadEnvFile } from 'node:process';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { Pool } from 'pg';
import { requireLocalDatabase } from '../../src/infrastructure/db/config';
vi.mock('server-only', () => ({}));
import { withTransaction } from '../../src/infrastructure/db/transaction';
if (!process.env.TEST_DATABASE_URL) loadEnvFile('.env.local');
const connectionString = requireLocalDatabase(process.env.TEST_DATABASE_URL, 'test');
const pool = new Pool({connectionString,max:1,connectionTimeoutMillis:3000});
describe('real PostgreSQL transaction boundary', () => {
  beforeAll(async () => {
    await pool.query('CREATE TEMP TABLE foundation_probe (value text NOT NULL)');
  });
  afterAll(async () => { await pool.end(); });
  it('commits on a single client and releases the connection', async () => {
    await withTransaction(pool, async client => {
      await client.query('INSERT INTO foundation_probe VALUES ($1)', ['committed']);
    });
    const result = await pool.query('SELECT value FROM foundation_probe');
    expect(result.rows).toEqual([{value:'committed'}]);
  });
  it('rolls back an interrupted operation and leaves the pool reusable', async () => {
    await expect(withTransaction(pool, async client => {
      await client.query('INSERT INTO foundation_probe VALUES ($1)', ['rolled-back']);
      throw new Error('intentional interruption');
    })).rejects.toThrow('intentional interruption');
    const result=await pool.query('SELECT value FROM foundation_probe');
    expect(result.rows).toEqual([{value:'committed'}]);
    expect((await pool.query('SELECT 1 AS healthy')).rows).toEqual([{healthy:1}]);
  });
});
