import axios, { AxiosError } from 'axios';
import type { Movement, CreateMovementData, ApiResponse, MonthlyReport } from '../types';

declare global {
    interface ImportMetaEnv {
        readonly VITE_API_URL?: string;
    }

    interface ImportMeta {
        readonly env: ImportMetaEnv;
    }
}

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

api.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        console.error('API Error:', error);
        if (error.response) {
            const status = error.response.status;
            const message = (error.response.data as { message?: string })?.message || error.message;
            switch (status) {
                case 400:
                    throw new Error(`Solicitud inválida: ${message}`);
                case 404:
                    throw new Error(`Recurso no encontrado: ${message}`);
                case 500:
                    throw new Error(`Error interno del servidor: ${message}`);
                default:
                    throw new Error(`Error ${status}: ${message}`);
            }
        } else if (error.request) {
            throw new Error('Error de conexión. Verifique que el servidor esté funcionando.');
        } else {
            throw new Error(`Error de configuración: ${error.message}`);
        }
    }
);

const handleApiError = (error: unknown, defaultMessage: string): never => {
    if (error instanceof Error) {
        throw error;
    }
    throw new Error(defaultMessage);
};

export const movementsApi = {
    create: async (data: CreateMovementData): Promise<ApiResponse<Movement>> => {
        try {
            const response = await api.post<ApiResponse<Movement>>('/movements', data);
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al crear movimiento');
            return {} as ApiResponse<Movement>;
        }
    },

    getAll: async (): Promise<ApiResponse<Movement[]>> => {
        try {
            const response = await api.get<ApiResponse<Movement[]>>('/movements');
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al obtener movimientos');
            return {} as ApiResponse<Movement[]>;
        }
    },

    getTotals: async (): Promise<ApiResponse<{ totalcreditos: number; totaldebitos: number; balance: number }>> => {
        try {
            const response = await api.get<ApiResponse<{ totalcreditos: number; totaldebitos: number; balance: number }>>('/movements/totals');
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al obtener totales');
            return {} as ApiResponse<{ totalcreditos: number; totaldebitos: number; balance: number }>;
        }
    },

    getById: async (id: number): Promise<ApiResponse<Movement>> => {
        try {
            const response = await api.get<ApiResponse<Movement>>(`/movements/${id}`);
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al obtener movimiento');
            return {} as ApiResponse<Movement>;
        }
    },

    delete: async (id: number): Promise<ApiResponse<void>> => {
        try {
            const response = await api.delete<ApiResponse<void>>(`/movements/${id}`);
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al eliminar movimiento');
            return {} as ApiResponse<void>;
        }
    },
};

export const reportsApi = {
    getMonthlyReport: async (year: number, month: number): Promise<ApiResponse<MonthlyReport>> => {
        try {
            const params = new URLSearchParams();
            params.append('year', year.toString());
            params.append('month', month.toString());
            const response = await api.get<ApiResponse<MonthlyReport>>(`/reports/monthly?${params}`);
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al generar reporte mensual');
            return {} as ApiResponse<MonthlyReport>;
        }
    },

    downloadMonthlyReport: async (year: number, month: number): Promise<void> => {
        try {
            const params = new URLSearchParams();
            params.append('year', year.toString());
            params.append('month', month.toString());
            const response = await api.get(`/reports/monthly/download?${params}`, {
                responseType: 'blob',
            });
            const blob = new Blob([response.data], { type: 'text/plain;charset=utf-8' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte_mensual_${year}_${month.toString().padStart(2, '0')}.txt`;
            document.body.appendChild(link);
            link.click();
            setTimeout(() => {
                document.body.removeChild(link);
                window.URL.revokeObjectURL(url);
            }, 100);
        } catch (error: unknown) {
            handleApiError(error, 'Error al descargar reporte');
        }
    },

    getAvailableReports: async (): Promise<ApiResponse<Array<{ year: number; month: number; fecha: string }>>> => {
        try {
            const response = await api.get<ApiResponse<Array<{ year: number; month: number; fecha: string }>>>('/reports/available');
            return response.data;
        } catch (error: unknown) {
            handleApiError(error, 'Error al obtener reportes disponibles');
            return {} as ApiResponse<Array<{ year: number; month: number; fecha: string }>>;
        }
    },
};

export const healthCheck = async (): Promise<boolean> => {
    try {
        const response = await api.get('/health');
        return response.status === 200;
    } catch (error: unknown) {
        console.warn('Health check failed:', error);
        return false;
    }
};

export { api };

export const apiConfig = {
    baseURL: API_BASE_URL,
    timeout: 10000,
} as const;