import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, Typography, Alert } from '@mui/material';
import { CameraAlt, Stop } from '@mui/icons-material';
import QrScanner from 'qr-scanner';

const QRScanner = ({ onScan }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const scannerRef = useRef(null);
  const startPendingRef = useRef(false);

  // Check if we're in a secure context (required for camera access)
  const isSecureContext = () => {
    return window.isSecureContext || 
           window.location.hostname === 'localhost' || 
           window.location.hostname === '127.0.0.1' ||
           window.location.protocol === 'https:';
  };

  const requestCameraPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      // Stop all tracks to release the camera for QR scanner
      stream.getTracks().forEach(track => track.stop());
      return true;
    } catch (err) {
      console.error('Camera permission error:', err);
      return false;
    }
  };

  // Initialize scanner after video element is rendered
  useEffect(() => {
    const initScanner = async () => {
      if (startPendingRef.current && videoRef.current) {
        try {
          // Create QR scanner instance
          scannerRef.current = new QrScanner(
            videoRef.current,
            result => {
              // QR code detected
              console.log('QR code detected:', result.data);
              onScan(result.data);
            },
            {
              highlightScanRegion: true,
              highlightCodeOutline: true,
              maxScansPerSecond: 5,
            }
          );

          // Start scanning
          await scannerRef.current.start();
          console.log('QR scanner started successfully');
        } catch (err) {
          console.error('Scanner initialization error:', err);
          let errorMessage = `Unable to start scanner. `;
          
          if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
            errorMessage += 'Permission denied. Please allow camera access in your browser settings.';
          } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
            errorMessage += 'No camera found. Please ensure you have a working camera connected.';
          } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
            errorMessage += 'Camera is already in use. Please close other applications using the camera.';
          } else {
            errorMessage += err.message || 'Please check permissions and try again.';
          }
          
          setError(errorMessage);
          setIsScanning(false);
          startPendingRef.current = false;
          return;
        }
        
        startPendingRef.current = false;
      }
    };

    initScanner();
  }, [isScanning, onScan]);

  const startScanning = async () => {
    try {
      setError('');
      
      // Check if we're in a secure context
      if (!isSecureContext()) {
        throw new Error('Camera access requires a secure context (HTTPS or localhost). Please ensure you are running on localhost or using HTTPS.');
      }

      // Check for camera permission
      const hasPermission = await requestCameraPermission();
      if (!hasPermission) {
        throw new Error('Camera permission denied. Please allow camera access when prompted and ensure no other application is using the camera.');
      }

      // Set state to render video element
      setIsScanning(true);
      startPendingRef.current = true;
      
      // The actual scanner initialization will happen in useEffect after the video element is rendered
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = `Unable to access camera. `;
      
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMessage += 'Permission denied. Please allow camera access in your browser settings and ensure no other application is using the camera.';
      } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
        errorMessage += 'No camera found. Please ensure you have a working camera connected.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMessage += 'Camera is already in use. Please close other applications using the camera.';
      } else if (err.name === 'AbortError' || err.name === 'NotSupportedError') {
        errorMessage += 'Camera access not supported. Please try a different browser.';
      } else {
        errorMessage += err.message || 'Please check permissions and try again.';
      }
      
      setError(errorMessage);
      setIsScanning(false);
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      scannerRef.current.destroy();
      scannerRef.current = null;
    }
    setIsScanning(false);
    startPendingRef.current = false;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopScanning();
    };
  }, []);

  return (
    <Box sx={{ textAlign: 'center' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      {!isScanning ? (
        <Box>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Click the button below to start scanning QR codes
          </Typography>
          <Button
            variant="contained"
            startIcon={<CameraAlt />}
            onClick={startScanning}
            size="large"
          >
            Start Camera
          </Button>
          {!isSecureContext() && (
            <Alert severity="warning" sx={{ mt: 2 }}>
              Note: Camera access requires a secure connection. Make sure you're accessing this page via localhost or HTTPS.
            </Alert>
          )}
        </Box>
      ) : (
        <Box>
          <Box sx={{ position: 'relative', mb: 2 }}>
            <video
              ref={videoRef}
              style={{
                width: '100%',
                maxWidth: '400px',
                height: 'auto',
                border: '2px solid #1976d2',
                borderRadius: '8px'
              }}
            />
          </Box>
          
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
            <Button
              variant="outlined"
              startIcon={<Stop />}
              onClick={stopScanning}
              color="error"
            >
              Stop Camera
            </Button>
          </Box>
          
          <Typography variant="caption" display="block" sx={{ mt: 2 }}>
            Position the QR code within the camera view
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default QRScanner;