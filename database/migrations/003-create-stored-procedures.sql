CREATE OR REPLACE FUNCTION sp_generate_monthly_report(
    p_year INTEGER,
    p_month INTEGER
)
RETURNS TABLE(
    total_creditos DECIMAL(15,2),
    total_debitos DECIMAL(15,2),
    balance DECIMAL(15,2),
    fecha_inicio DATE,
    fecha_fin DATE,
    total_movimientos INTEGER
) AS $$
DECLARE
    v_fecha_inicio DATE;
    v_fecha_fin DATE;
BEGIN
    v_fecha_inicio := DATE(p_year || '-' || LPAD(p_month::TEXT, 2, '0') || '-01');
    v_fecha_fin := (v_fecha_inicio + INTERVAL '1 month' - INTERVAL '1 day')::DATE;
    
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN m.tipo = 'CREDITO' THEN m.monto ELSE 0 END), 0) as total_creditos,
        COALESCE(SUM(CASE WHEN m.tipo = 'DEBITO' THEN ABS(m.monto) ELSE 0 END), 0) as total_debitos,
        COALESCE(SUM(m.monto), 0) as balance,
        v_fecha_inicio as fecha_inicio,
        v_fecha_fin as fecha_fin,
        COUNT(*)::INTEGER as total_movimientos
    FROM movements m
    WHERE m.fecha >= v_fecha_inicio 
    AND m.fecha <= v_fecha_fin;
    
    IF NOT FOUND THEN
        RETURN QUERY
        SELECT 
            0::DECIMAL(15,2) as total_creditos,
            0::DECIMAL(15,2) as total_debitos, 
            0::DECIMAL(15,2) as balance,
            v_fecha_inicio as fecha_inicio,
            v_fecha_fin as fecha_fin,
            0::INTEGER as total_movimientos;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION sp_generate_general_report()
RETURNS TABLE(
    total_creditos DECIMAL(15,2),
    total_debitos DECIMAL(15,2),
    balance DECIMAL(15,2),
    total_movimientos INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(CASE WHEN m.tipo = 'CREDITO' THEN m.monto ELSE 0 END), 0) as total_creditos,
        COALESCE(SUM(CASE WHEN m.tipo = 'DEBITO' THEN ABS(m.monto) ELSE 0 END), 0) as total_debitos,
        COALESCE(SUM(m.monto), 0) as balance,
        COUNT(*)::INTEGER as total_movimientos
    FROM movements m;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION sp_generate_monthly_report(INTEGER, INTEGER) IS 'Genera reporte mensual de movimientos';
COMMENT ON FUNCTION sp_generate_general_report() IS 'Genera reporte general de todos los movimientos';