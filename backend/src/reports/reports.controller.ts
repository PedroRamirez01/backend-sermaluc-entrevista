import {
  Controller,
  Get,
  Query,
  HttpStatus,
  BadRequestException,
  Res,
} from '@nestjs/common';
import type { Response } from 'express';
import { ReportsService } from './reports.service';
import {
  MonthlyReportResponse,
  AvailableReportsResponse,
} from './types/report.types';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('monthly')
  async getMonthlyReport(
    @Query('year') year: string,
    @Query('month') month: string,
  ): Promise<MonthlyReportResponse> {
    if (!year || !month) {
      throw new BadRequestException(
        'Los parámetros year y month son obligatorios',
      );
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      throw new BadRequestException('Year y month deben ser números válidos');
    }

    if (monthNum < 1 || monthNum > 12) {
      throw new BadRequestException('Month debe estar entre 1 y 12');
    }

    if (yearNum < 2000 || yearNum > new Date().getFullYear() + 1) {
      throw new BadRequestException('Year debe ser un año válido');
    }

    const reportData = await this.reportsService.generateMonthlyReport(
      yearNum,
      monthNum,
    );

    return {
      success: true,
      message: 'Reporte mensual generado exitosamente',
      data: reportData,
      statusCode: HttpStatus.OK,
    };
  }

  @Get('monthly/download')
  async downloadMonthlyReport(
    @Query('year') year: string,
    @Query('month') month: string,
    @Res() res: Response,
  ): Promise<void> {
    if (!year || !month) {
      throw new BadRequestException(
        'Los parámetros year y month son obligatorios',
      );
    }

    const yearNum = parseInt(year, 10);
    const monthNum = parseInt(month, 10);

    if (isNaN(yearNum) || isNaN(monthNum)) {
      throw new BadRequestException('Year y month deben ser números válidos');
    }

    const reportData = await this.reportsService.generateMonthlyReport(
      yearNum,
      monthNum,
    );
    const reportText = this.reportsService.generateMonthlyReportText(
      reportData,
      yearNum,
      monthNum,
    );

    const filename = `reporte_mensual_${yearNum}_${monthNum.toString().padStart(2, '0')}.txt`;

    res.set({
      'Content-Type': 'text/plain; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Content-Length': Buffer.byteLength(reportText, 'utf8'),
    });

    res.send(reportText);
  }

  @Get('available')
  async getAvailableReports(): Promise<AvailableReportsResponse> {
    const reports = await this.reportsService.getAvailableReports();

    return {
      success: true,
      message: 'Reportes disponibles obtenidos exitosamente',
      data: reports,
      statusCode: HttpStatus.OK,
    };
  }
}
