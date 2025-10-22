SELECT 
    table_name,
    table_type 
FROM information_schema.tables 
WHERE table_schema = 'public';

SELECT 
    routine_name,
    routine_type 
FROM information_schema.routines 
WHERE routine_schema = 'public';

SELECT 
    trigger_name,
    event_object_table,
    action_timing,
    event_manipulation
FROM information_schema.triggers 
WHERE trigger_schema = 'public';

SELECT 
    'Movimientos insertados' as descripcion,
    COUNT(*) as cantidad
FROM movements;

SELECT * FROM sp_generate_monthly_report(2024, 10);