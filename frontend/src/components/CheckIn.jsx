import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  Tabs,
  Tab,
  Card,
  CardContent,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from '@mui/material';
import { QrCodeScanner, PersonAdd, ExpandMore, List } from '@mui/icons-material';
import { ticketAPI } from '../services/api';
import QRScanner from './QRScanner';

const CheckIn = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [referenceNumber, setReferenceNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [availableTickets, setAvailableTickets] = useState([]);

  useEffect(() => {
    fetchAvailableTickets();
  }, []);

  const fetchAvailableTickets = async () => {
    try {
      const response = await ticketAPI.getAllTickets();
      const uncheckedTickets = response.data
        .filter(ticket => !ticket.checkedIn)
        .sort((a, b) => a.customerName.localeCompare(b.customerName)); // Sort alphabetically
      setAvailableTickets(uncheckedTickets);
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
    setMessage('');
    setReferenceNumber('');
  };

  const handleCheckIn = async (refNum) => {
    const cleanRefNum = refNum.trim();
    
    if (!cleanRefNum) {
      setMessage('Please enter a reference number');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await ticketAPI.checkIn(cleanRefNum);
      setMessage(`Successfully checked in ${response.data.customerName} (${response.data.ticketType})! Total revenue: $${response.data.totalRevenue}`);
      setMessageType('success');
      setReferenceNumber('');
      // Refresh the available tickets list
      fetchAvailableTickets();
    } catch (error) {
      let errorMessage = 'Check-in failed';
      
      if (error.response?.status === 404) {
        errorMessage = `Ticket not found. Please verify the reference number: ${cleanRefNum}`;
      } else if (error.response?.status === 400) {
        errorMessage = error.response?.data?.message || 'Ticket already checked in';
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setMessage(errorMessage);
      setMessageType('error');
      console.error('Check-in error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleManualCheckIn = () => {
    handleCheckIn(referenceNumber);
  };

  const handleQRScan = (result) => {
    if (result) {
      setReferenceNumber(result);
      handleCheckIn(result);
    } else {
      setMessage('Failed to scan QR code. Please try again and ensure the QR code is fully visible in the camera view.');
      setMessageType('error');
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center" color="primary">
          Event Check-In
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={handleTabChange} centered>
            <Tab icon={<QrCodeScanner />} label="QR Code Scan" />
            <Tab icon={<PersonAdd />} label="Manual Entry" />
          </Tabs>
        </Box>

        {message && (
          <Alert severity={messageType} sx={{ mb: 3 }}>
            {message}
          </Alert>
        )}

        {activeTab === 0 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Scan QR Code
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Make sure to allow camera access when prompted by your browser
              </Typography>
              <QRScanner onScan={handleQRScan} />
            </CardContent>
          </Card>
        )}

        {activeTab === 1 && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Manual Entry
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  fullWidth
                  label="Ticket Reference Number"
                  value={referenceNumber}
                  onChange={(e) => setReferenceNumber(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleManualCheckIn();
                    }
                  }}
                  disabled={loading}
                />
                <Button
                  variant="contained"
                  onClick={handleManualCheckIn}
                  disabled={loading || !referenceNumber.trim()}
                  sx={{ minWidth: 120 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Check In'}
                </Button>
              </Box>
            </CardContent>
          </Card>
        )}
        
        {/* Available Tickets Helper */}
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMore />}>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <List sx={{ mr: 1 }} />
              <Typography variant="h6">
                Available Tickets ({availableTickets.length})
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Click on any reference number below to use it for check-in:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {availableTickets.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No tickets available for check-in
                </Typography>
              ) : (
                availableTickets.map((ticket) => (
                  <Chip
                    key={ticket.referenceNumber}
                    label={`${ticket.customerName} (${ticket.ticketType})`}
                    variant="outlined"
                    clickable
                    onClick={() => {
                      setReferenceNumber(ticket.referenceNumber);
                      setActiveTab(1); // Switch to manual entry tab
                    }}
                    sx={{ mb: 1 }}
                  />
                ))
              )}
            </Box>
          </AccordionDetails>
        </Accordion>
      </Paper>
    </Container>
  );
};

export default CheckIn;