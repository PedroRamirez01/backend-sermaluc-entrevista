INSERT INTO movements (fecha, tipo, monto, descripcion) VALUES
('2025-10-01', 'CREDITO', 1000.00, 'Depósito inicial'),
('2025-10-02', 'DEBITO', -250.00, 'Retiro ATM'),
('2025-10-03', 'CREDITO', 500.00, 'Transferencia recibida'),
('2025-10-04', 'DEBITO', -100.00, 'Compra supermercado'),
('2025-10-05', 'CREDITO', 750.00, 'Salario'),
('2025-10-06', 'DEBITO', -50.00, 'Comisión bancaria'),
('2025-09-15', 'CREDITO', 2000.00, 'Bono septiembre'),
('2025-09-20', 'DEBITO', -300.00, 'Pago servicios'),
('2025-10-01', 'CREDITO', 1200.00, 'Freelance proyecto'),
('2025-10-03', 'DEBITO', -80.00, 'Gasolina');

SELECT 
    fecha,
    tipo,
    monto,
    descripcion
FROM movements 
ORDER BY fecha DESC;