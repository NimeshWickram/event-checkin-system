import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Alert,
  CircularProgress,
  Divider,
} from '@mui/material';
import {
  AttachMoney,
  TrendingUp,
  AccountBalance,
  Assessment,
} from '@mui/icons-material';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';
import { ticketAPI } from '../services/api';

const Finance = () => {
  const [financeData, setFinanceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchFinanceData = async () => {
    try {
      setLoading(true);
      const response = await ticketAPI.getFinanceStats();
      setFinanceData(response.data);
      setError('');
    } catch (err) {
      setError('Failed to load finance data');
      console.error('Finance data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(fetchFinanceData, 30000);
    return () => clearInterval(interval);
  }, []);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

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

  // Custom label renderer for pie chart to ensure visibility and prevent overlap
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name, value }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize={12}
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  if (loading && !financeData) {
    return (
      <Container maxWidth="lg" sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress size={50} />
        <Typography variant="h6" sx={{ mt: 2 }}>
          Loading Finance Data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom color="primary">
        Finance Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {financeData && (
        <>
          {/* Revenue Overview Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#1976d2', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Total Revenue
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financeData.totalRevenue)}
                      </Typography>
                    </Box>
                    <AttachMoney sx={{ fontSize: 50, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#4caf50', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Checked-In Revenue
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financeData.checkedInRevenue)}
                      </Typography>
                    </Box>
                    <TrendingUp sx={{ fontSize: 50, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#ff9800', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Pending Revenue
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financeData.pendingRevenue)}
                      </Typography>
                    </Box>
                    <AccountBalance sx={{ fontSize: 50, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Card sx={{ bgcolor: '#9c27b0', color: 'white' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                      <Typography variant="h6" gutterBottom>
                        Avg Ticket Price
                      </Typography>
                      <Typography variant="h4">
                        {formatCurrency(financeData.averageTicketPrice)}
                      </Typography>
                    </Box>
                    <Assessment sx={{ fontSize: 50, opacity: 0.8 }} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Charts Row */}
          <Grid container spacing={4} sx={{ mb: 4 }}>
            {/* Revenue by Ticket Type - Pie Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue by Ticket Type
                  </Typography>
                  <Box sx={{ height: 400, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={financeData.revenueByTicketType.map(item => ({
                            name: item.ticketType,
                            value: item.totalRevenue,
                            fill: getTicketTypeColor(item.ticketType),
                          }))}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={renderCustomizedLabel}
                          outerRadius={120}
                          innerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          paddingAngle={2}
                        >
                          {financeData.revenueByTicketType.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={getTicketTypeColor(entry.ticketType)} 
                            />
                          ))}
                          <LabelList 
                            dataKey="name" 
                            position="outside" 
                            offset={10}
                            style={{ fontSize: '12px' }}
                          />
                        </Pie>
                        <Tooltip 
                          formatter={(value) => formatCurrency(value)}
                          contentStyle={{
                            borderRadius: '8px',
                            border: '1px solid #e0e0e0',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                          }}
                          labelFormatter={(value) => `Ticket Type: ${value}`}
                        />
                        <Legend 
                          layout="horizontal" 
                          verticalAlign="bottom" 
                          align="center"
                          wrapperStyle={{ paddingTop: '20px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Revenue Comparison - Bar Chart */}
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Revenue: Total vs Checked-In
                  </Typography>
                  <ResponsiveContainer width="100%" height={400}>
                    <BarChart
                      data={financeData.revenueByTicketType.map(item => ({
                        ticketType: item.ticketType,
                        totalRevenue: item.totalRevenue,
                        checkedInRevenue: item.checkedInRevenue,
                      }))}
                      margin={{ top: 20, right: 30, left: 20, bottom: 80 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="ticketType" 
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis />
                      <Tooltip 
                        formatter={(value) => formatCurrency(value)}
                        contentStyle={{
                          borderRadius: '8px',
                          border: '1px solid #e0e0e0',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="totalRevenue" fill="#2196f3" name="Total Revenue" />
                      <Bar dataKey="checkedInRevenue" fill="#4caf50" name="Checked-In Revenue" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Detailed Revenue Table */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Revenue Breakdown by Ticket Type
              </Typography>
              <Grid container spacing={2}>
                {financeData.revenueByTicketType.map((typeData) => (
                  <Grid item xs={12} sm={6} md={4} key={typeData.ticketType}>
                    <Card variant="outlined">
                      <CardContent>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                          <Box
                            sx={{
                              width: 12,
                              height: 12,
                              borderRadius: '50%',
                              bgcolor: getTicketTypeColor(typeData.ticketType),
                              mr: 1,
                            }}
                          />
                          <Typography variant="h6">{typeData.ticketType}</Typography>
                        </Box>
                        
                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Total Revenue
                          </Typography>
                          <Typography variant="h6">
                            {formatCurrency(typeData.totalRevenue)}
                          </Typography>
                        </Box>

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Checked-In Revenue
                          </Typography>
                          <Typography variant="h6" color="success.main">
                            {formatCurrency(typeData.checkedInRevenue)}
                          </Typography>
                        </Box>

                        <Divider sx={{ my: 1 }} />

                        <Box sx={{ mb: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                            Tickets Sold
                          </Typography>
                          <Typography variant="body1">
                            {typeData.ticketCount}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            Average Price
                          </Typography>
                          <Typography variant="body1">
                            {formatCurrency(typeData.averagePrice)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        </>
      )}
    </Container>
  );
};

export default Finance;