export interface MonthlyReportResult {
  total_creditos: string;
  total_debitos: string;
  balance: string;
  fecha_inicio: string;
  fecha_fin: string;
  total_movimientos: string;
}

export interface MonthlyReportData {
  total_creditos: number;
  total_debitos: number;
  balance: number;
  cantidad_movimientos_credito: number;
  cantidad_movimientos_debito: number;
  fecha_inicio: string;
  fecha_fin: string;
}

export interface MovementCount {
  creditos: string;
  debitos: string;
}

export interface MonthlyReportResponse {
  success: boolean;
  message: string;
  data: MonthlyReportData;
  statusCode: number;
}

export interface AvailableReportsResponse {
  success: boolean;
  message: string;
  data: Array<{ year: number; month: number; fecha: string }>;
  statusCode: number;
}
