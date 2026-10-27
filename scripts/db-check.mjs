import { Pool } from 'pg';
import { requireLocalDatabase, readPoolMax } from '../src/infrastructure/db/config.ts';
const connectionString=requireLocalDatabase(process.env.DATABASE_URL,'development');
const pool=new Pool({connectionString,max:readPoolMax(process.env.DATABASE_POOL_MAX),connectionTimeoutMillis:3000});
try {
 const result=await pool.query('SELECT current_database() AS database, current_setting(\'server_version\') AS version');
 console.log('Local database connected:',result.rows[0]);
} catch { console.error('Local database check failed. Check Docker and .env.local; credentials are not logged.');process.exitCode=1; }
finally {await pool.end();}
