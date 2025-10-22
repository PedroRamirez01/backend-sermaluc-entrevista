import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import {
  MonthlyReportResult,
  MonthlyReportData,
  MovementCount,
} from './types/report.types';

@Injectable()
export class ReportsService {
  constructor(
    @InjectDataSource()
    private dataSource: DataSource,
  ) {}

  async generateMonthlyReport(
    year: number,
    month: number,
  ): Promise<MonthlyReportData> {
    try {
      const result = await this.dataSource.query(
        'SELECT * FROM sp_generate_monthly_report($1, $2)',
        [year, month],
      );

      if (!result || !Array.isArray(result) || result.length === 0) {
        throw new BadRequestException('No se pudo generar el reporte');
      }

      const reportData = result[0] as MonthlyReportResult;

      const movementCounts = await this.dataSource.query(
        `
        SELECT 
          COUNT(CASE WHEN tipo = 'CREDITO' THEN 1 END) as creditos,
          COUNT(CASE WHEN tipo = 'DEBITO' THEN 1 END) as debitos
        FROM movements 
        WHERE fecha >= $1 AND fecha <= $2
        `,
        [reportData.fecha_inicio, reportData.fecha_fin],
      );

      const counts = movementCounts[0] as MovementCount;

      return {
        total_creditos: Number(reportData.total_creditos) || 0,
        total_debitos: Number(reportData.total_debitos) || 0,
        balance: Number(reportData.balance) || 0,
        cantidad_movimientos_credito: Number(counts?.creditos) || 0,
        cantidad_movimientos_debito: Number(counts?.debitos) || 0,
        fecha_inicio: reportData.fecha_inicio,
        fecha_fin: reportData.fecha_fin,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(`
        Error al generar reporte mensual: ${errorMessage}`);
    }
  }

  async getAvailableReports(): Promise<
    Array<{ year: number; month: number; fecha: string }>
  > {
    try {
      interface ReportRow {
        year: string;
        month: string;
        fecha: string;
      }

      const result = await this.dataSource.query<ReportRow[]>(`
        SELECT DISTINCT 
          EXTRACT(YEAR FROM fecha) as year,
          EXTRACT(MONTH FROM fecha) as month,
          TO_CHAR(fecha, 'YYYY-MM') as fecha
        FROM movements 
        ORDER BY year DESC, month DESC
      `);

      return result.map((row) => ({
        year: Number(row.year),
        month: Number(row.month),
        fecha: row.fecha,
      }));
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error';
      throw new BadRequestException(
        `Error al obtener reportes disponibles: ${errorMessage}`,
      );
    }
  }

  generateMonthlyReportText(
    reportData: MonthlyReportData,
    year: number,
    month: number,
  ): string {
    const monthNames = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre',
    ];

    const monthName = monthNames[month - 1];
    return `
═══════════════════════════════════════════════════════════════
                    REPORTE MENSUAL DE MOVIMIENTOS
═══════════════════════════════════════════════════════════════

PERÍODO: ${monthName} ${year}
FECHA DE GENERACIÓN: ${new Date().toLocaleString('es-ES')}
RANGO: ${new Date(reportData.fecha_inicio).toLocaleDateString('es-ES')} - ${new Date(reportData.fecha_fin).toLocaleDateString('es-ES')}

───────────────────────────────────────────────────────────────
                           RESUMEN FINANCIERO
───────────────────────────────────────────────────────────────

Total Créditos:      ${reportData.total_creditos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
Total Débitos:       ${reportData.total_debitos.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}
Balance Final:       ${reportData.balance.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })}

───────────────────────────────────────────────────────────────
                        DETALLE DE MOVIMIENTOS
───────────────────────────────────────────────────────────────

Movimientos de Crédito:    ${reportData.cantidad_movimientos_credito}
Movimientos de Débito:     ${reportData.cantidad_movimientos_debito}
Total de Movimientos:      ${reportData.cantidad_movimientos_credito + reportData.cantidad_movimientos_debito}

───────────────────────────────────────────────────────────────

Estado del Balance: ${reportData.balance >= 0 ? '✓ POSITIVO' : '⚠ NEGATIVO'}

═══════════════════════════════════════════════════════════════
                    Generado por Sistema Sermaluc
═══════════════════════════════════════════════════════════════
    `.trim();
  }
}
