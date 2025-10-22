CREATE TYPE movement_type AS ENUM ('CREDITO', 'DEBITO');

CREATE TABLE movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    fecha DATE NOT NULL,
    tipo movement_type NOT NULL,
    monto DECIMAL(15,2) NOT NULL,
    descripcion VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_movements_fecha ON movements(fecha);
CREATE INDEX idx_movements_tipo ON movements(tipo);
CREATE INDEX idx_movements_fecha_tipo ON movements(fecha, tipo);

COMMENT ON TABLE movements IS 'Tabla de movimientos financieros';
COMMENT ON COLUMN movements.id IS 'Identificador único del movimiento';
COMMENT ON COLUMN movements.fecha IS 'Fecha del movimiento';
COMMENT ON COLUMN movements.tipo IS 'Tipo de movimiento: CREDITO o DEBITO';
COMMENT ON COLUMN movements.monto IS 'Monto del movimiento (positivo para créditos, negativo para débitos)';
COMMENT ON COLUMN movements.descripcion IS 'Descripción opcional del movimiento';