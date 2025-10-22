import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { MovementRepository } from './repositories/movement.repository';
import { CreateMovementDto } from './dto/create-movement.dto';
import { MovementResponseDto } from './dto/movement-response.dto';
import { MovementType } from './entities/movement.entity';

@Injectable()
export class MovementsService {
  constructor(private readonly movementRepository: MovementRepository) {}

  async create(
    createMovementDto: CreateMovementDto,
  ): Promise<MovementResponseDto> {
    try {
      const { tipo } = createMovementDto;
      let { monto } = createMovementDto;

      if (tipo === MovementType.DEBITO) {
        monto = monto > 0 ? -Math.abs(monto) : monto;
      } else if (tipo === MovementType.CREDITO) {
        monto = Math.abs(monto);
      }

      const movementData = {
        ...createMovementDto,
        monto,
      };

      const movement = await this.movementRepository.create(movementData);
      return new MovementResponseDto(movement);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al crear el movimiento: ' + errorMessage,
      );
    }
  }

  async findAll(): Promise<MovementResponseDto[]> {
    try {
      const movements = await this.movementRepository.findAll();
      return movements.map((movement) => new MovementResponseDto(movement));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al obtener movimientos: ' + errorMessage,
      );
    }
  }

  async findOne(id: string): Promise<MovementResponseDto> {
    const movement = await this.movementRepository.findById(id);
    if (!movement) {
      throw new NotFoundException(`Movimiento con ID ${id} no encontrado`);
    }
    return new MovementResponseDto(movement);
  }

  async getTotals() {
    try {
      return await this.movementRepository.getTotals();
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al calcular totales: ' + errorMessage,
      );
    }
  }

  async getMovementsByDateRange(
    startDate: Date,
    endDate: Date,
  ): Promise<MovementResponseDto[]> {
    try {
      const movements = await this.movementRepository.findByDateRange(
        startDate,
        endDate,
      );
      return movements.map((movement) => new MovementResponseDto(movement));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        'Error al obtener movimientos por rango de fecha: ' + errorMessage,
      );
    }
  }
}
