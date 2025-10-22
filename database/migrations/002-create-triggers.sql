CREATE OR REPLACE FUNCTION validate_movement_amount()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.tipo = 'CREDITO' AND NEW.monto <= 0 THEN
        RAISE EXCEPTION 'Los movimientos de tipo CREDITO deben tener monto positivo. Monto recibido: %', NEW.monto;
    END IF;
    
    IF NEW.tipo = 'DEBITO' AND NEW.monto >= 0 THEN
        RAISE EXCEPTION 'Los movimientos de tipo DEBITO deben tener monto negativo. Monto recibido: %', NEW.monto;
    END IF;
    
    IF TG_OP = 'UPDATE' THEN
        NEW.updated_at = CURRENT_TIMESTAMP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_movement_amount
    BEFORE INSERT OR UPDATE ON movements
    FOR EACH ROW
    EXECUTE FUNCTION validate_movement_amount();

COMMENT ON FUNCTION validate_movement_amount() IS 'Función que valida los montos según el tipo de movimiento';