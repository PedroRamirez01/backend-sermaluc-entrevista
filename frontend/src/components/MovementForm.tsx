import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import type { CreateMovementData } from '../types';
import { movementsApi } from '../services/api';
import {
    Card,
    CardContent,
    Typography,
    TextField,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Box,
    InputAdornment,
    FormHelperText,
    Chip,
    Stack
} from '@mui/material';
import {
    Add as AddIcon,
    TrendingUp,
    TrendingDown,
    AttachMoney as MoneyIcon,
    CalendarToday,
    Description
} from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';

interface MovementFormProps {
    onMovementCreated: () => void;
}

export const MovementForm: React.FC<MovementFormProps> = ({ onMovementCreated }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const {
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<CreateMovementData>();

    const onSubmit = async (data: CreateMovementData) => {
        setIsSubmitting(true);
        setMessage(null);

        try {
            if (data.tipo === 'DEBITO' && data.monto > 0) {
                data.monto = -Math.abs(data.monto);
            } else if (data.tipo === 'CREDITO' && data.monto < 0) {
                data.monto = Math.abs(data.monto);
            }

            const response = await movementsApi.create(data);

            if (response.success) {
                setMessage({ type: 'success', text: response.message || 'Movimiento creado exitosamente' });
                reset();
                onMovementCreated();
            } else {
                setMessage({ type: 'error', text: response.message || 'Error al crear movimiento' });
            }
        } catch (error: unknown) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Error de conexión. Verifique que el servidor esté funcionando.';
            setMessage({ type: 'error', text: errorMessage });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Card elevation={0} sx={{ border: 1, borderColor: 'divider' }}>
            <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            bgcolor: 'primary.main',
                            color: 'white',
                            mr: 2
                        }}
                    >
                        <AddIcon />
                    </Box>
                    <Box>
                        <Typography variant="h6" component="h2" fontWeight="bold">
                            Registrar Nuevo Movimiento
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Complete el formulario para registrar un movimiento financiero
                        </Typography>
                    </Box>
                </Box>

                {message && (
                    <Alert
                        severity={message.type}
                        sx={{ mb: 3 }}
                        onClose={() => setMessage(null)}
                    >
                        {message.text}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit(onSubmit)}>
                    <Stack spacing={3}>
                        <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                            <Controller
                                name="fecha"
                                control={control}
                                defaultValue={new Date().toISOString().split('T')[0]}
                                render={({ field }) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        type="date"
                                        label="Fecha"
                                        variant="outlined"
                                        InputLabelProps={{ shrink: true }}
                                        InputProps={{
                                            startAdornment: (
                                                <InputAdornment position="start">
                                                    <CalendarToday color="action" />
                                                </InputAdornment>
                                            ),
                                        }}
                                        error={!!errors.fecha}
                                        helperText={errors.fecha?.message}
                                    />
                                )}
                            />

                            <Controller
                                name="tipo"
                                control={control}
                                defaultValue={undefined}
                                rules={{ required: 'El tipo es obligatorio' }}
                                render={({ field }) => (
                                    <FormControl fullWidth variant="outlined" error={!!errors.tipo}>
                                        <InputLabel>Tipo de Movimiento</InputLabel>
                                        <Select
                                            {...field}
                                            label="Tipo de Movimiento"
                                            value={field.value || ""}
                                        >
                                            <MenuItem value="">
                                                <em>Seleccione un tipo</em>
                                            </MenuItem>
                                            <MenuItem value="CREDITO">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TrendingUp color="success" />
                                                    <span>Crédito (+)</span>
                                                    <Chip label="Ingreso" size="small" color="success" variant="outlined" />
                                                </Box>
                                            </MenuItem>
                                            <MenuItem value="DEBITO">
                                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <TrendingDown color="error" />
                                                    <span>Débito (-)</span>
                                                    <Chip label="Egreso" size="small" color="error" variant="outlined" />
                                                </Box>
                                            </MenuItem>
                                        </Select>
                                        {errors.tipo && (
                                            <FormHelperText>{errors.tipo.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                )}
                            />
                        </Stack>

                        <Controller
                            name="monto"
                            control={control}
                            defaultValue={0}
                            rules={{
                                required: 'El monto es obligatorio',
                                min: { value: 0.01, message: 'El monto debe ser mayor a 0' }
                            }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    type="number"
                                    label="Monto"
                                    variant="outlined"
                                    inputProps={{
                                        step: 0.01,
                                        min: 0
                                    }}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <MoneyIcon color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                    placeholder="Ingrese el monto"
                                    error={!!errors.monto}
                                    helperText={
                                        errors.monto?.message ||
                                        "Ingrese siempre un valor positivo. El sistema aplicará automáticamente el signo según el tipo."
                                    }
                                />
                            )}
                        />

                        <Controller
                            name="descripcion"
                            control={control}
                            defaultValue=""
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Descripción (Opcional)"
                                    variant="outlined"
                                    placeholder="Descripción del movimiento"
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Description color="action" />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}
                        />

                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 2 }}>
                            <LoadingButton
                                type="submit"
                                variant="contained"
                                loading={isSubmitting}
                                startIcon={<AddIcon />}
                                size="large"
                                sx={{
                                    minWidth: 180,
                                    height: 48,
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontSize: '1rem',
                                    fontWeight: 600
                                }}
                            >
                                Crear Movimiento
                            </LoadingButton>
                        </Box>
                    </Stack>
                </Box>
            </CardContent>
        </Card>
    );
};