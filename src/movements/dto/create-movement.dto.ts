import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { MovementType } from '../entities/movement.entity';

export class CreateMovementDto {
  @IsNotEmpty()
  @IsDateString()
  fecha: string;

  @IsNotEmpty()
  @IsEnum(MovementType)
  tipo: MovementType;

  @IsNotEmpty()
  @IsNumber({ maxDecimalPlaces: 2 })
  @Type(() => Number)
  @Min(0.01, { message: 'El monto debe ser mayor a 0' })
  monto: number;

  @IsOptional()
  @IsString()
  @Transform(({ value }) => {
    if (value == null) return value;
    if (typeof value === 'string') return value.trim();
    return value;
  })
  descripcion?: string;
}
