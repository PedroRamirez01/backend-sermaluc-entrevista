import React, { useState, useEffect } from 'react';
import type { Movement } from '../types';
import { movementsApi } from '../services/api';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
    Card,
    CardContent,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Stack,
    Button,
    Alert,
    CircularProgress,
    Chip,
    IconButton,
    Tooltip
} from '@mui/material';
import {
    Refresh as RefreshIcon,
    TrendingUp,
    TrendingDown,
    TableChart as TableIcon,
    Description
} from '@mui/icons-material';

interface MovementsTableProps {
    refreshTrigger: number;
}

export const MovementsTable: React.FC<MovementsTableProps> = ({ refreshTrigger }) => {
    const [movements, setMovements] = useState<Movement[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMovements = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await movementsApi.getAll();

            if (response.success && response.data) {
                setMovements(response.data);
            } else {
                setError(response.message || 'Error al cargar movimientos');
            }
        } catch (err: unknown) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Error de conexión. Verifique que el servidor esté funcionando.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovements();
    }, [refreshTrigger]);

    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('es-CL', {
            style: 'currency',
            currency: 'CLP',
            minimumFractionDigits: 2,
        }).format(amount);
    };

    const formatDate = (dateString: string): string => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: es });
        } catch {
            return dateString;
        }
    };

    const formatDateTime = (dateString: string): string => {
        try {
            return format(new Date(dateString), 'dd/MM/yyyy HH:mm', { locale: es });
        } catch {
            return dateString;
        }
    };

    if (loading) {
        return (
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <CardContent>
                    <Stack
                        direction="row"
                        alignItems="center"
                        justifyContent="center"
                        spacing={2}
                        sx={{ py: 8 }}
                    >
                        <CircularProgress size={24} />
                        <Typography color="text.secondary">
                            Cargando movimientos...
                        </Typography>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    if (error) {
        return (
            <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
                <CardContent>
                    <Stack spacing={3} alignItems="center" sx={{ py: 4 }}>
                        <Alert severity="error" sx={{ width: '100%' }}>
                            {error}
                        </Alert>
                        <Button
                            variant="contained"
                            onClick={fetchMovements}
                            startIcon={<RefreshIcon />}
                        >
                            Reintentar
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    sx={{ mb: 3 }}
                >
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                width: 40,
                                height: 40,
                                borderRadius: '50%',
                                bgcolor: 'primary.main',
                                color: 'white'
                            }}
                        >
                            <TableIcon />
                        </Box>
                        <Box>
                            <Typography variant="h6" component="h2" fontWeight="bold">
                                Lista de Movimientos
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {movements.length} movimiento{movements.length !== 1 ? 's' : ''} registrado{movements.length !== 1 ? 's' : ''}
                            </Typography>
                        </Box>
                    </Stack>

                    <Tooltip title="Actualizar lista">
                        <IconButton
                            onClick={fetchMovements}
                            disabled={loading}
                            color="primary"
                            sx={{
                                border: 1,
                                borderColor: 'primary.main',
                                '&:hover': { bgcolor: 'primary.50' }
                            }}
                        >
                            <RefreshIcon sx={{
                                animation: loading ? 'spin 1s linear infinite' : 'none',
                                '@keyframes spin': {
                                    '0%': { transform: 'rotate(0deg)' },
                                    '100%': { transform: 'rotate(360deg)' }
                                }
                            }} />
                        </IconButton>
                    </Tooltip>
                </Stack>

                {movements.length === 0 ? (
                    <Stack alignItems="center" spacing={2} sx={{ py: 8 }}>
                        <Description sx={{ fontSize: 48, color: 'text.disabled' }} />
                        <Typography variant="h6" color="text.secondary">
                            No hay movimientos registrados
                        </Typography>
                        <Typography variant="body2" color="text.disabled">
                            Los movimientos aparecerán aquí una vez que los registre
                        </Typography>
                    </Stack>
                ) : (
                    <TableContainer component={Paper} variant="outlined">
                        <Table sx={{ minWidth: 650 }}>
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'grey.50' }}>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Tipo</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }} align="right">Monto</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Descripción</TableCell>
                                    <TableCell sx={{ fontWeight: 'bold' }}>Fecha Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {movements.map((movement) => (
                                    <TableRow
                                        key={movement.id}
                                        sx={{
                                            '&:hover': { bgcolor: 'grey.50' },
                                            '&:last-child td, &:last-child th': { border: 0 }
                                        }}
                                    >
                                        <TableCell>
                                            <Typography variant="body2" fontWeight="medium">
                                                {formatDate(movement.fecha)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Chip
                                                icon={movement.tipo === 'CREDITO' ?
                                                    <TrendingUp /> : <TrendingDown />
                                                }
                                                label={movement.tipo}
                                                color={movement.tipo === 'CREDITO' ? 'success' : 'error'}
                                                variant="outlined"
                                                size="small"
                                                sx={{ fontWeight: 'medium' }}
                                            />
                                        </TableCell>

                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                color={movement.tipo === 'CREDITO' ? 'success.main' : 'error.main'}
                                            >
                                                {formatCurrency(movement.monto)}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography
                                                variant="body2"
                                                color="text.secondary"
                                                sx={{
                                                    maxWidth: 200,
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}
                                            >
                                                {movement.descripcion || '-'}
                                            </Typography>
                                        </TableCell>

                                        <TableCell>
                                            <Typography variant="caption" color="text.disabled">
                                                {formatDateTime(movement.createdAt)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </CardContent>
        </Card>
    );
};