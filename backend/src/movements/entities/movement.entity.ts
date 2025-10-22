import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum MovementType {
  CREDITO = 'CREDITO',
  DEBITO = 'DEBITO',
}

@Entity('movements')
export class Movement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'date' })
  fecha: Date;

  @Column({
    type: 'enum',
    enum: MovementType,
    enumName: 'movement_type',
  })
  tipo: MovementType;

  @Column('decimal', { precision: 15, scale: 2 })
  monto: number;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'descripcion',
  })
  descripcion?: string;

  @CreateDateColumn({
    type: 'timestamptz',
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamptz',
    name: 'updated_at',
  })
  updatedAt: Date;
}
