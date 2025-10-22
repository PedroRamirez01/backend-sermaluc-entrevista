
import './App.css'
import { useState } from 'react';
import { MovementForm } from './components/MovementForm';
import { MovementsTable } from './components/MovementsTable';
import { ReportsSection } from './components/ReportsSection';
import {
  Typography,
  Container,
  Box,
  Paper,
  Card,
  CardContent,
  Stack
} from '@mui/material';
import { AccountBalance } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    },
  },
});

function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleMovementCreated = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>

        <Container maxWidth="lg">
          <Box sx={{ space: 3 }}>
            <Card
              sx={{
                background: 'linear-gradient(135deg, #1976d2 0%, #1565c0 100%)',
                color: 'white',
                mb: 4
              }}
            >
              <CardContent sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <AccountBalance sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography variant="h4" component="h2" fontWeight="bold" gutterBottom>
                      Bienvenido al Sistema Financiero
                    </Typography>
                    <Typography variant="body1" sx={{ opacity: 0.9 }}>
                      Registre movimientos, consulte historial y genere reportes mensuales consolidados.
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Stack spacing={4}>
              <Paper elevation={2} sx={{ p: 3 }}>
                <MovementForm onMovementCreated={handleMovementCreated} />
              </Paper>

              <Paper elevation={2} sx={{ p: 3 }}>
                <MovementsTable refreshTrigger={refreshTrigger} />
              </Paper>

              <Paper elevation={2} sx={{ p: 3 }}>
                <ReportsSection />
              </Paper>
            </Stack>
          </Box>
        </Container>

        <Paper
          component="footer"
          elevation={1}
          sx={{
            mt: 8,
            py: 3,
            backgroundColor: 'white',
            borderTop: 1,
            borderColor: 'divider'
          }}
        >
          <Container maxWidth="lg">
            <Box textAlign="center">
              <Typography variant="body2" color="text.secondary">
                © 2024 Sermaluc - Sistema de Movimientos Financieros
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                Desarrollado con React, NestJS y PostgreSQL
              </Typography>
            </Box>
          </Container>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}

export default App
