import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseUUIDPipe,
  HttpStatus,
} from '@nestjs/common';
import { MovementsService } from './movements.service';
import { CreateMovementDto } from './dto/create-movement.dto';

@Controller('movements')
export class MovementsController {
  constructor(private readonly movementsService: MovementsService) {}

  @Post()
  async create(@Body() createMovementDto: CreateMovementDto) {
    const movement = await this.movementsService.create(createMovementDto);
    return {
      success: true,
      message: 'Movimiento creado exitosamente',
      data: movement,
      statusCode: HttpStatus.CREATED,
    };
  }

  @Get()
  async findAll() {
    const movements = await this.movementsService.findAll();
    return {
      success: true,
      message: 'Movimientos obtenidos exitosamente',
      data: movements,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('totals')
  async getTotals() {
    const totals = await this.movementsService.getTotals();
    return {
      success: true,
      message: 'Totales calculados exitosamente',
      data: totals,
      statusCode: HttpStatus.OK,
    };
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const movement = await this.movementsService.findOne(id);
    return {
      success: true,
      message: 'Movimiento obtenido exitosamente',
      data: movement,
      statusCode: HttpStatus.OK,
    };
  }
}
