# SQL migrations

Business schema starts in TASK-004; no placeholder business migration is applied in TASK-003.

Use timestamp-prefixed SQL files with node-pg-migrate 9 sections:

```sql
-- Up Migration
-- Forward SQL goes here.

-- Down Migration
-- Reversal SQL goes here, reviewed separately before any rollback.
```

`npm run db:migrate:status` reads applied migration metadata and source filenames without writes.
`npm run db:migrate:plan` previews pending migrations. In node-pg-migrate 9, dry-run can initialize its public.pgmigrations bookkeeping table; it is not a read-only command and applies no business migration SQL.
`npm run db:migrate` applies pending local migrations with migration credentials.
No down/reset command is provided by default. Never run schema migration on a request.
