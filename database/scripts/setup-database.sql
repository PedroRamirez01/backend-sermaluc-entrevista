-- \i migrations/001-create-movements-table.sql
-- \i migrations/002-create-triggers.sql
-- \i migrations/003-create-stored-procedures.sql

-- \i seeds/movements-seed.sql

-- SELECT 'Base de datos configurada correctamente' as status;

\i /docker-entrypoint-initdb.d/scripts/setup-database.sql

SELECT 'Base de datos configurada correctamente con Docker' as status;