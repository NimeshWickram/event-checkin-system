import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  LinearProgress,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  Groups,
  ConfirmationNumber,
  CheckCircle,
  Schedule,
} from '@mui/icons-material';
import { ticketAPI } from '../services/api';

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ticketsResponse, statsResponse] = await Promise.all([
        ticketAPI.getAllTickets(),
        ticketAPI.getStats(),
      ]);
      
      setTickets(ticketsResponse.data);
      setStats(statsResponse.data);
      setError('');
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getTicketTypeColor = (type) => {
    const colors = {
      'VIP': '#9c27b0',
      'Standard': '#2196f3',
      'Student': '#4caf50',
      'Bundle Offer': '#ff9800',
      'Early Bird': '#f44336',
    };
    return colors[type] || '#757575';
  };

  if (loading && !stats) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Dashboard...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Event Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {stats && (
        <>
          {/* Total Attendance Card */}
          <Card sx={{ mb: 3, bgcolor: '#1976d2', color: 'white' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h6" gutterBottom>
                    Total Attendance
                  </Typography>
                  <Typography variant="h3">
                    {stats.totalCheckedIn} / {stats.totalTickets}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    {Math.round((stats.totalCheckedIn / stats.totalTickets) * 100)}% checked in
                  </Typography>
                </Box>
                <Groups sx={{ fontSize: 60, opacity: 0.8 }} />
              </Box>
              <LinearProgress
                variant="determinate"
                value={(stats.totalCheckedIn / stats.totalTickets) * 100}
                sx={{
                  mt: 2,
                  height: 8,
                  borderRadius: 4,
                  bgcolor: 'rgba(255,255,255,0.2)',
                  '& .MuiLinearProgress-bar': {
                    bgcolor: '#fff',
                  },
                }}
              />
            </CardContent>
          </Card>

          {/* Ticket Type Stats */}
          <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
            {stats.ticketTypeStats.map((typeStats) => (
              <Grid item xs={12} sm={6} md={4} key={typeStats.ticketType}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <ConfirmationNumber
                        sx={{ 
                          color: getTicketTypeColor(typeStats.ticketType),
                          mr: 1 
                        }}
                      />
                      <Typography variant="h6" component="div">
                        {typeStats.ticketType}
                      </Typography>
                    </Box>
                    
                    <Typography variant="h4" color="primary" gutterBottom>
                      {typeStats.checkedIn} / {typeStats.total}
                    </Typography>
                    
                    <LinearProgress
                      variant="determinate"
                      value={typeStats.percentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        mb: 1,
                        bgcolor: 'rgba(0,0,0,0.1)',
                        '& .MuiLinearProgress-bar': {
                          bgcolor: getTicketTypeColor(typeStats.ticketType),
                        },
                      }}
                    />
                    
                    <Typography variant="body2" color="text.secondary">
                      {typeStats.percentage}% checked in
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {/* Tickets Table */}
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            All Tickets
          </Typography>
          
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Reference Number</TableCell>
                  <TableCell>Customer Name</TableCell>
                  <TableCell>Ticket Type</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">Total Revenue</TableCell>
                  <TableCell align="center">Status</TableCell>
                  <TableCell>Check-in Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tickets.map((ticket) => (
                  <TableRow key={ticket.referenceNumber}>
                    <TableCell>
                      <Typography variant="body2" fontFamily="monospace">
                        {ticket.referenceNumber}
                      </Typography>
                    </TableCell>
                    <TableCell>{ticket.customerName}</TableCell>
                    <TableCell>
                      <Chip
                        label={ticket.ticketType}
                        size="small"
                        sx={{
                          bgcolor: getTicketTypeColor(ticket.ticketType),
                          color: 'white',
                          fontWeight: 'bold',
                        }}
                      />
                    </TableCell>
                    <TableCell align="center">{ticket.quantity}</TableCell>
                    <TableCell align="right">
                      ${ticket.price?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      ${ticket.totalRevenue?.toFixed(2) || 'N/A'}
                    </TableCell>
                    <TableCell align="center">
                      <Chip
                        icon={ticket.checkedIn ? <CheckCircle /> : <Schedule />}
                        label={ticket.checkedIn ? 'Checked In' : 'Pending'}
                        color={ticket.checkedIn ? 'success' : 'default'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {ticket.checkedInAt
                        ? new Date(ticket.checkedInAt).toLocaleString()
                        : '-'}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Container>
  );
};

export default Dashboard;