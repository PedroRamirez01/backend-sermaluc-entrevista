import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Movement, MovementType } from '../entities/movement.entity';
import { CreateMovementDto } from '../dto/create-movement.dto';

interface TotalsQueryResult {
  totalcreditos: string | null;
  totaldebitos: string | null;
  balance: string | null;
  totalmovements: string | null;
}

@Injectable()
export class MovementRepository {
  constructor(
    @InjectRepository(Movement)
    private readonly repository: Repository<Movement>,
  ) {}

  async create(createMovementDto: CreateMovementDto): Promise<Movement> {
    const movement = this.repository.create(createMovementDto);
    return await this.repository.save(movement);
  }

  async findAll(): Promise<Movement[]> {
    return await this.repository.find({
      order: { fecha: 'DESC', createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Movement> {
    const movement = await this.repository.findOne({ where: { id } });
    if (!movement) {
      throw new NotFoundException(`Movement with ID ${id} not found`);
    }
    return movement;
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Movement[]> {
    return await this.repository.find({
      where: {
        fecha: Between(startDate, endDate),
      },
      order: { fecha: 'ASC' },
    });
  }

  async getTotals() {
    const result = await this.repository
      .createQueryBuilder('movement')
      .select([
        'SUM(CASE WHEN movement.tipo = :credito THEN movement.monto ELSE 0 END) as total_creditos',
        'SUM(CASE WHEN movement.tipo = :debito THEN ABS(movement.monto) ELSE 0 END) as total_debitos',
        'SUM(movement.monto) as balance',
        'COUNT(*) as total_movimientos',
      ])
      .setParameters({
        credito: MovementType.CREDITO,
        debito: MovementType.DEBITO,
      })
      .getRawOne() as TotalsQueryResult;

    if (!result) {
      return {
        totalCreditos: 0,
        totalDebitos: 0,
        balance: 0,
        totalMovements: 0,
      };
    }

    return {
      totalCreditos: Number(result.totalcreditos) || 0,
      totalDebitos: Number(result.totaldebitos) || 0,
      balance: Number(result.balance) || 0,
      totalMovements: Number(result.totalmovements) || 0,
    };
  }
}
