INSERT INTO movements (fecha, tipo, monto, descripcion) VALUES
('2024-10-01', 'CREDITO', 1000.00, 'Depósito inicial'),
('2024-10-02', 'DEBITO', -250.00, 'Retiro ATM'),
('2024-10-03', 'CREDITO', 500.00, 'Transferencia recibida'),
('2024-10-04', 'DEBITO', -100.00, 'Compra supermercado'),
('2024-10-05', 'CREDITO', 750.00, 'Salario'),
('2024-10-06', 'DEBITO', -50.00, 'Comisión bancaria'),
('2024-09-15', 'CREDITO', 2000.00, 'Bono septiembre'),
('2024-09-20', 'DEBITO', -300.00, 'Pago servicios'),
('2024-11-01', 'CREDITO', 1200.00, 'Freelance proyecto'),
('2024-11-03', 'DEBITO', -80.00, 'Gasolina');

SELECT 
    fecha,
    tipo,
    monto,
    descripcion
FROM movements 
ORDER BY fecha DESC;