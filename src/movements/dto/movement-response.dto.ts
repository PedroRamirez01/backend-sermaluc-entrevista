import { MovementType } from '../entities/movement.entity';

interface MovementData {
  id: string;
  fecha: string | Date;
  tipo: MovementType;
  monto: number | string;
  descripcion?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export class MovementResponseDto {
  id: string;
  fecha: string;
  tipo: MovementType;
  monto: number;
  descripcion?: string;
  createdAt: string;
  updatedAt: string;

  constructor(movement: MovementData) {
    this.id = movement.id;
    this.fecha =
      movement.fecha instanceof Date
        ? movement.fecha.toISOString().split('T')[0]
        : movement.fecha;
    this.tipo = movement.tipo;
    this.monto = Number(movement.monto);
    this.descripcion = movement.descripcion;
    this.createdAt =
      movement.createdAt instanceof Date
        ? movement.createdAt.toISOString()
        : movement.createdAt;
    this.updatedAt =
      movement.updatedAt instanceof Date
        ? movement.updatedAt.toISOString()
        : movement.updatedAt;
  }
}
