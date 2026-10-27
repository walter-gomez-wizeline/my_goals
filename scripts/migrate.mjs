import { runner } from 'node-pg-migrate';
import { requireLocalDatabase } from '../src/infrastructure/db/config.ts';
const args=process.argv.slice(2);
if (args[0]!=='up' || args.some(x=>!['up','--dry-run'].includes(x))) throw new Error('Only local up and up --dry-run are supported.');
const databaseUrl=requireLocalDatabase(process.env.MIGRATION_DATABASE_URL,'development');
try {
 const changes=await runner({databaseUrl,dir:'migrations',migrationsTable:'pgmigrations',direction:'up',dryRun:args.includes('--dry-run'),singleTransaction:true,checkOrder:true,ignorePattern:'.*\\.md$',log:()=>{}});
 console.log(`${args.includes('--dry-run')?'Dry run':'Migration run'} completed: ${changes.length} pending migrations${args.includes('--dry-run')?' (not applied)':''}.`);
} catch {console.error('Local migration command failed. No connection credentials are logged.');process.exitCode=1;}
