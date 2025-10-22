SELECT * FROM sp_generate_monthly_report(2024, 10);
SELECT * FROM sp_generate_monthly_report(2024, 9);

SELECT * FROM sp_generate_general_report();

SELECT COUNT(*) as total_movements FROM movements;

SELECT 
    tipo,
    COUNT(*) as cantidad,
    SUM(monto) as total
FROM movements 
GROUP BY tipo;
