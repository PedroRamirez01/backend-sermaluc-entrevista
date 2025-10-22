import React, { useState } from "react";
import { reportsApi } from "../services/api";
import type { MonthlyReport } from "../types";
import {
    Card,
    CardContent,
    Typography,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Box,
    Stack,
    Paper,
    Divider,
} from "@mui/material";
import {
    Assessment as ReportIcon,
    Download as DownloadIcon,
    CalendarToday,
    TrendingUp,
    TrendingDown,
    AccountBalance,
} from "@mui/icons-material";
import { LoadingButton } from "@mui/lab";

export const ReportsSection: React.FC = () => {
    const [report, setReport] = useState<MonthlyReport | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<number>(
        new Date().getFullYear()
    );
    const [selectedMonth, setSelectedMonth] = useState<number>(
        new Date().getMonth() + 1
    );

    const generateReport = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await reportsApi.getMonthlyReport(
                selectedYear,
                selectedMonth
            );

            if (response.success && response.data) {
                setReport(response.data);
            } else {
                setError(response.message || "Error al generar reporte");
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : "Error de conexión. Verifique que el servidor esté funcionando.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const downloadReport = async () => {
        try {
            await reportsApi.downloadMonthlyReport(selectedYear, selectedMonth);
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error ? err.message : "Error al descargar reporte.";
            setError(errorMessage);
        }
    };

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat("es-ES", {
            style: "currency",
            currency: "EUR",
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const getMonthName = (month: number): string => {
        const months = [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
        ];
        return months[month - 1];
    };

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - 2 + i);
    const months = Array.from({ length: 12 }, (_, i) => i + 1);

    return (
        <Card elevation={0} sx={{ border: 1, borderColor: "divider" }}>
            <CardContent sx={{ p: 3 }}>
                <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 3 }}>
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            bgcolor: "primary.main",
                            color: "white",
                        }}
                    >
                        <ReportIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" component="h2" fontWeight="bold">
                            Reportes Mensuales
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Genere y descargue reportes consolidados por período
                        </Typography>
                    </Box>
                </Stack>

                <Stack spacing={4}>
                    <Paper
                        variant="outlined"
                        sx={{
                            p: 3,
                            bgcolor: "grey.50",
                            border: 1,
                            borderColor: "grey.200",
                        }}
                    >
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={2}
                            sx={{ mb: 2 }}
                        >
                            <CalendarToday color="action" />
                            <Typography variant="subtitle1" fontWeight="medium">
                                Seleccionar Período
                            </Typography>
                        </Stack>

                        <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
                            <FormControl variant="outlined" sx={{ minWidth: 120 }}>
                                <InputLabel>Año</InputLabel>
                                <Select
                                    value={selectedYear}
                                    onChange={(e) => setSelectedYear(Number(e.target.value))}
                                    label="Año"
                                >
                                    {years.map((year) => (
                                        <MenuItem key={year} value={year}>
                                            {year}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>

                            <FormControl variant="outlined" sx={{ minWidth: 150 }}>
                                <InputLabel>Mes</InputLabel>
                                <Select
                                    value={selectedMonth}
                                    onChange={(e) => setSelectedMonth(Number(e.target.value))}
                                    label="Mes"
                                >
                                    {months.map((month) => (
                                        <MenuItem key={month} value={month}>
                                            {getMonthName(month)}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Stack>
                    </Paper>

                    <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                        <LoadingButton
                            onClick={generateReport}
                            loading={loading}
                            variant="contained"
                            startIcon={<ReportIcon />}
                            size="large"
                            sx={{
                                minWidth: 180,
                                textTransform: "none",
                                fontWeight: 600,
                            }}
                        >
                            {loading ? "Generando..." : "Generar Reporte"}
                        </LoadingButton>

                        {report && (
                            <LoadingButton
                                onClick={downloadReport}
                                variant="outlined"
                                startIcon={<DownloadIcon />}
                                size="large"
                                sx={{
                                    minWidth: 160,
                                    textTransform: "none",
                                    fontWeight: 600,
                                }}
                            >
                                Descargar TXT
                            </LoadingButton>
                        )}
                    </Stack>

                    {error && (
                        <Alert
                            severity="error"
                            onClose={() => setError(null)}
                            sx={{ borderRadius: 2 }}
                        >
                            {error}
                        </Alert>
                    )}

                    {report && (
                        <Stack spacing={3}>
                            <Divider />

                            <Box>
                                <Typography variant="h6" fontWeight="bold" gutterBottom>
                                    Reporte de {getMonthName(selectedMonth)} {selectedYear}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Período:{" "}
                                    {new Date(report.fecha_inicio).toLocaleDateString("es-ES")} -{" "}
                                    {new Date(report.fecha_fin).toLocaleDateString("es-ES")}
                                </Typography>
                            </Box>

                            <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
                                <Card
                                    sx={{
                                        flex: 1,
                                        background:
                                            "linear-gradient(135deg, #4caf50 0%, #388e3c 100%)",
                                        color: "white",
                                    }}
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Total Créditos
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {formatCurrency(report.total_creditos)}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ opacity: 0.8, mt: 1 }}
                                                >
                                                    {report.cantidad_movimientos_credito} movimientos
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.2)",
                                                    borderRadius: "50%",
                                                    p: 2,
                                                }}
                                            >
                                                <TrendingUp sx={{ fontSize: 32 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        flex: 1,
                                        background:
                                            "linear-gradient(135deg, #f44336 0%, #d32f2f 100%)",
                                        color: "white",
                                    }}
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Total Débitos
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {formatCurrency(report.total_debitos)}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ opacity: 0.8, mt: 1 }}
                                                >
                                                    {report.cantidad_movimientos_debito} movimientos
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.2)",
                                                    borderRadius: "50%",
                                                    p: 2,
                                                }}
                                            >
                                                <TrendingDown sx={{ fontSize: 32 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>

                                <Card
                                    sx={{
                                        flex: 1,
                                        background:
                                            report.balance >= 0
                                                ? "linear-gradient(135deg, #2196f3 0%, #1976d2 100%)"
                                                : "linear-gradient(135deg, #ff9800 0%, #f57c00 100%)",
                                        color: "white",
                                    }}
                                >
                                    <CardContent>
                                        <Stack
                                            direction="row"
                                            alignItems="center"
                                            justifyContent="space-between"
                                        >
                                            <Box>
                                                <Typography variant="body2" sx={{ opacity: 0.9 }}>
                                                    Balance Final
                                                </Typography>
                                                <Typography variant="h4" fontWeight="bold">
                                                    {formatCurrency(report.balance)}
                                                </Typography>
                                                <Typography
                                                    variant="body2"
                                                    sx={{ opacity: 0.8, mt: 1 }}
                                                >
                                                    {report.cantidad_movimientos_credito +
                                                        report.cantidad_movimientos_debito}{" "}
                                                    movimientos total
                                                </Typography>
                                            </Box>
                                            <Box
                                                sx={{
                                                    bgcolor: "rgba(255,255,255,0.2)",
                                                    borderRadius: "50%",
                                                    p: 2,
                                                }}
                                            >
                                                <AccountBalance sx={{ fontSize: 32 }} />
                                            </Box>
                                        </Stack>
                                    </CardContent>
                                </Card>
                            </Stack>
                        </Stack>
                    )}
                </Stack>
            </CardContent>
        </Card>
    );
};
