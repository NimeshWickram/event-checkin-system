import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import {
  ThemeProvider,
  createTheme,
  CssBaseline,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Dashboard as DashboardIcon, QrCodeScanner, AccountBalance } from '@mui/icons-material';
import Dashboard from './components/Dashboard';
import CheckIn from './components/CheckIn';
import Finance from './components/Finance';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Event Check-In System
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                component={Link}
                to="/"
                startIcon={<DashboardIcon />}
              >
                Dashboard
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/finance"
                startIcon={<AccountBalance />}
              >
                Finance
              </Button>
              <Button
                color="inherit"
                component={Link}
                to="/checkin"
                startIcon={<QrCodeScanner />}
              >
                Check-In
              </Button>
            </Box>
          </Toolbar>
        </AppBar>
        
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance" element={<Finance />} />
          <Route path="/checkin" element={<CheckIn />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
