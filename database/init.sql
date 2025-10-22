\i /docker-entrypoint-initdb.d/migrations/001-create-movements-table.sql
\i /docker-entrypoint-initdb.d/migrations/002-create-triggers.sql
\i /docker-entrypoint-initdb.d/migrations/003-create-stored-procedures.sql

\i /docker-entrypoint-initdb.d/seeds/movements-seed.sql

SELECT 'Inicialización completada correctamente' as mensaje;
SELECT COUNT(*) as total_movimientos FROM movements;