import { Client } from 'pg';
import { readdir } from 'node:fs/promises';
import { requireLocalDatabase } from '../src/infrastructure/db/config.ts';
const client=new Client({connectionString:requireLocalDatabase(process.env.MIGRATION_DATABASE_URL,'development'),connectionTimeoutMillis:3000});
try {
 await client.connect();
 await client.query('BEGIN READ ONLY');
 const {rows}=await client.query("SELECT to_regclass('public.pgmigrations') AS metadata");
 const applied=rows[0].metadata ? (await client.query('SELECT name, run_on FROM public.pgmigrations ORDER BY id')).rows : [];
 const sourceFiles=(await readdir('migrations')).filter(name=>name.endsWith('.sql')).sort();
 await client.query('COMMIT');
 console.log(JSON.stringify({applied,sqlSourceFiles:sourceFiles},null,2));
} catch {console.error('Local migration status failed. No credentials are logged.');process.exitCode=1;}
finally {await client.end();}
