import {
  IsNotEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  IsDateString,
  MaxLength,
} from 'class-validator';
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
  monto: number;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  descripcion?: string;
}
