DROP TRIGGER IF EXISTS trigger_validate_movement_amount ON movements;

DROP FUNCTION IF EXISTS validate_movement_amount();
DROP FUNCTION IF EXISTS sp_generate_monthly_report(INTEGER, INTEGER);
DROP FUNCTION IF EXISTS sp_generate_general_report();

DROP TABLE IF EXISTS movements;

DROP TYPE IF EXISTS movement_type;

SELECT 'Base de datos limpiada correctamente' as status;