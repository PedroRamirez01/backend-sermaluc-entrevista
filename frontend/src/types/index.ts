export interface Movement {
    id: string;
    fecha: string;
    tipo: 'DEBITO' | 'CREDITO';
    monto: number;
    descripcion?: string;
    createdAt: string;
}

export interface CreateMovementData {
    fecha?: string;
    tipo: 'DEBITO' | 'CREDITO';
    monto: number;
    descripcion?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
}

export interface MonthlyReport {
    total_creditos: number;
    total_debitos: number;
    balance: number;
    cantidad_movimientos_credito: number;
    cantidad_movimientos_debito: number;
    fecha_inicio: string;
    fecha_fin: string;
}
