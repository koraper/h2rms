# QR Code Usage Guide

This guide covers implementing QR code functionality in H2RMS for attendance tracking, employee identification, and document management.

## Overview

H2RMS uses QR codes for:
- Employee check-in/check-out
- Employee identification
- Document access and verification
- Asset tracking
- Location-based attendance
- Event registration

## QR Code Libraries

### 1. Install Dependencies

```bash
# For generating QR codes
npm install qrcode qrcode.js

# For reading QR codes (client-side)
npm install qr-scanner

# For server-side QR code reading
npm install jsqr sharp

# React QR code components
npm install react-qr-code react-qr-reader
```

### 2. Library Comparison

| Library | Purpose | Platform | Features |
|---------|---------|----------|----------|
| qrcode | Generate | Node.js/Browser | Lightweight, flexible |
| qr-scanner | Read | Browser | Camera access |
| jsqr | Read | Node.js | Image processing |
| react-qr-code | Generate | React | Component-based |
| react-qr-reader | Read | React | Camera integration |

## QR Code Generation

### 1. Basic QR Code Generator

Create `utils/qrGenerator.js`:

```javascript
import QRCode from 'qrcode';

export class QRCodeGenerator {
  static async generateDataURL(data, options = {}) {
    const defaultOptions = {
      width: 200,
      margin: 1,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    };

    const mergedOptions = { ...defaultOptions, ...options };

    try {
      return await QRCode.toDataURL(data, mergedOptions);
    } catch (error) {
      console.error('QR Code generation failed:', error);
      throw new Error('Failed to generate QR code');
    }
  }

  static async generateBuffer(data, options = {}) {
    try {
      return await QRCode.toBuffer(data, options);
    } catch (error) {
      console.error('QR Code buffer generation failed:', error);
      throw new Error('Failed to generate QR code buffer');
    }
  }

  static generateSVG(data, options = {}) {
    return QRCode.toString(data, { type: 'svg', ...options });
  }

  // Generate employee check-in QR code
  static async generateEmployeeQR(employeeId, expiresAt = null) {
    const payload = {
      type: 'employee_checkin',
      employeeId,
      timestamp: Date.now(),
      expiresAt: expiresAt || (Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    };

    const qrData = JSON.stringify(payload);
    return await this.generateDataURL(qrData);
  }

  // Generate location-based attendance QR code
  static async generateLocationQR(locationId, locationName) {
    const payload = {
      type: 'location_checkin',
      locationId,
      locationName,
      timestamp: Date.now()
    };

    const qrData = JSON.stringify(payload);
    return await this.generateDataURL(qrData, {
      width: 300,
      color: {
        dark: '#1e40af', // Blue theme
        light: '#ffffff'
      }
    });
  }

  // Generate document access QR code
  static async generateDocumentQR(documentId, accessLevel = 'read') {
    const payload = {
      type: 'document_access',
      documentId,
      accessLevel,
      timestamp: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    const qrData = JSON.stringify(payload);
    return await this.generateDataURL(qrData);
  }
}
```

### 2. QR Code Component

Create `components/QRCodeDisplay.js`:

```javascript
import React, { useState, useEffect } from 'react';
import QRCode from 'react-qr-code';

const QRCodeDisplay = ({
  data,
  size = 200,
  title = '',
  showData = false,
  refreshInterval = null,
  onRefresh = null,
  className = ''
}) => {
  const [qrData, setQrData] = useState(data);
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    if (refreshInterval && onRefresh) {
      const interval = setInterval(() => {
        onRefresh().then(newData => {
          setQrData(newData);
        });
      }, refreshInterval * 1000);

      return () => clearInterval(interval);
    }
  }, [refreshInterval, onRefresh]);

  useEffect(() => {
    if (refreshInterval) {
      const interval = setInterval(() => {
        setTimeLeft(prev => prev ? prev - 1 : refreshInterval);
      }, 1000);

      setTimeLeft(refreshInterval);
      return () => clearInterval(interval);
    }
  }, [refreshInterval, qrData]);

  return (
    <div className={`qr-code-container ${className}`}>
      {title && (
        <h3 className="text-lg font-semibold mb-4 text-center">{title}</h3>
      )}

      <div className="flex justify-center mb-4">
        <div className="p-4 bg-white rounded-lg shadow-lg">
          <QRCode
            value={qrData}
            size={size}
            style={{ height: "auto", maxWidth: "100%", width: "100%" }}
          />
        </div>
      </div>

      {timeLeft && (
        <div className="text-center text-sm text-gray-600 mb-2">
          Refreshes in: {timeLeft}s
        </div>
      )}

      {showData && (
        <div className="text-xs text-gray-500 break-all p-2 bg-gray-100 rounded">
          {qrData}
        </div>
      )}
    </div>
  );
};

export default QRCodeDisplay;
```

## QR Code Reading

### 1. QR Code Scanner Component

Create `components/QRCodeScanner.js`:

```javascript
import React, { useState, useRef, useEffect } from 'react';
import QrScanner from 'qr-scanner';

const QRCodeScanner = ({
  onScan,
  onError,
  className = '',
  showViewFinder = true,
  preferredCamera = 'environment'
}) => {
  const videoRef = useRef();
  const scannerRef = useRef();
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [hasPermission, setHasPermission] = useState(null);

  useEffect(() => {
    initializeScanner();
    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
      }
    };
  }, []);

  const initializeScanner = async () => {
    try {
      // Check camera permission
      const hasCamera = await QrScanner.hasCamera();
      if (!hasCamera) {
        onError?.('No camera available');
        return;
      }

      // Get available cameras
      const cameraList = await QrScanner.listCameras(true);
      setCameras(cameraList);

      // Select preferred camera
      const preferredCam = cameraList.find(camera =>
        camera.label.toLowerCase().includes(preferredCamera)
      ) || cameraList[0];

      setSelectedCamera(preferredCam);
      setupScanner(preferredCam);
    } catch (error) {
      console.error('Scanner initialization failed:', error);
      onError?.('Failed to initialize camera');
      setHasPermission(false);
    }
  };

  const setupScanner = (camera) => {
    if (!videoRef.current) return;

    scannerRef.current = new QrScanner(
      videoRef.current,
      (result) => {
        try {
          // Try to parse as JSON first
          const parsedData = JSON.parse(result.data);
          onScan?.(parsedData);
        } catch (error) {
          // If not JSON, pass as string
          onScan?.(result.data);
        }
      },
      {
        onDecodeError: (error) => {
          console.warn('QR decode error:', error);
        },
        preferredCamera: camera?.id,
        highlightScanRegion: showViewFinder,
        highlightCodeOutline: true,
        maxScansPerSecond: 5
      }
    );

    setHasPermission(true);
  };

  const startScanning = async () => {
    if (!scannerRef.current) return;

    try {
      await scannerRef.current.start();
      setIsScanning(true);
    } catch (error) {
      console.error('Failed to start scanner:', error);
      onError?.('Failed to start camera');
    }
  };

  const stopScanning = () => {
    if (scannerRef.current) {
      scannerRef.current.stop();
      setIsScanning(false);
    }
  };

  const switchCamera = (cameraId) => {
    if (scannerRef.current) {
      scannerRef.current.setCamera(cameraId);
      const selectedCam = cameras.find(cam => cam.id === cameraId);
      setSelectedCamera(selectedCam);
    }
  };

  if (hasPermission === false) {
    return (
      <div className={`qr-scanner-container ${className}`}>
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">
            Camera permission denied or not available
          </div>
          <button
            onClick={initializeScanner}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`qr-scanner-container ${className}`}>
      <div className="relative">
        <video
          ref={videoRef}
          className="w-full h-64 object-cover rounded-lg"
          playsInline
          muted
        />

        {showViewFinder && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-white opacity-50 rounded-lg"></div>
          </div>
        )}
      </div>

      <div className="flex justify-between items-center mt-4">
        <button
          onClick={isScanning ? stopScanning : startScanning}
          className={`px-6 py-2 rounded font-semibold ${
            isScanning
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isScanning ? 'Stop Scan' : 'Start Scan'}
        </button>

        {cameras.length > 1 && (
          <select
            value={selectedCamera?.id || ''}
            onChange={(e) => switchCamera(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded"
          >
            {cameras.map((camera) => (
              <option key={camera.id} value={camera.id}>
                {camera.label}
              </option>
            ))}
          </select>
        )}
      </div>
    </div>
  );
};

export default QRCodeScanner;
```

### 2. QR Data Processor

Create `utils/qrProcessor.js`:

```javascript
export class QRCodeProcessor {
  static validateQRData(data) {
    try {
      if (typeof data === 'string') {
        data = JSON.parse(data);
      }

      const requiredFields = ['type', 'timestamp'];
      const hasRequiredFields = requiredFields.every(field => data.hasOwnProperty(field));

      if (!hasRequiredFields) {
        throw new Error('Invalid QR code format');
      }

      // Check expiration
      if (data.expiresAt && Date.now() > data.expiresAt) {
        throw new Error('QR code has expired');
      }

      return { isValid: true, data };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }

  static async processEmployeeCheckin(qrData, currentUserId) {
    const validation = this.validateQRData(qrData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { data } = validation;

    if (data.type !== 'employee_checkin') {
      throw new Error('Invalid QR code type for check-in');
    }

    if (data.employeeId !== currentUserId) {
      throw new Error('QR code belongs to different employee');
    }

    // Process check-in
    const response = await fetch('/api/attendance/checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        qrData: data,
        timestamp: Date.now(),
        method: 'qr_code'
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Check-in failed');
    }

    return await response.json();
  }

  static async processLocationCheckin(qrData, userId) {
    const validation = this.validateQRData(qrData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { data } = validation;

    if (data.type !== 'location_checkin') {
      throw new Error('Invalid QR code type for location check-in');
    }

    const response = await fetch('/api/attendance/location-checkin', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        locationId: data.locationId,
        userId,
        timestamp: Date.now()
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Location check-in failed');
    }

    return await response.json();
  }

  static async processDocumentAccess(qrData, userId) {
    const validation = this.validateQRData(qrData);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }

    const { data } = validation;

    if (data.type !== 'document_access') {
      throw new Error('Invalid QR code type for document access');
    }

    const response = await fetch(`/api/documents/${data.documentId}/access`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        accessLevel: data.accessLevel,
        userId
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Document access failed');
    }

    return await response.json();
  }
}
```

## Implementation Examples

### 1. Employee Check-in System

Create `components/attendance/QRCheckinSystem.js`:

```javascript
import React, { useState, useEffect } from 'react';
import QRCodeDisplay from '../QRCodeDisplay';
import QRCodeScanner from '../QRCodeScanner';
import { QRCodeGenerator } from '../../utils/qrGenerator';
import { QRCodeProcessor } from '../../utils/qrProcessor';
import { useAuth } from '../../contexts/AuthContext';

const QRCheckinSystem = () => {
  const { user } = useAuth();
  const [mode, setMode] = useState('scan'); // 'scan' or 'generate'
  const [qrCode, setQrCode] = useState('');
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (mode === 'generate') {
      generateEmployeeQR();
    }
  }, [mode]);

  const generateEmployeeQR = async () => {
    try {
      setLoading(true);
      const qrData = await QRCodeGenerator.generateEmployeeQR(user.id);
      setQrCode(qrData);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleScan = async (scannedData) => {
    try {
      setLoading(true);
      const result = await QRCodeProcessor.processEmployeeCheckin(scannedData, user.id);
      setScanResult(result);
    } catch (error) {
      setScanResult({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleScanError = (error) => {
    setScanResult({ error });
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex mb-6">
        <button
          onClick={() => setMode('scan')}
          className={`flex-1 py-2 px-4 text-center font-semibold rounded-l-lg ${
            mode === 'scan'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Scan QR
        </button>
        <button
          onClick={() => setMode('generate')}
          className={`flex-1 py-2 px-4 text-center font-semibold rounded-r-lg ${
            mode === 'generate'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Generate QR
        </button>
      </div>

      {mode === 'scan' ? (
        <div>
          <h3 className="text-lg font-semibold mb-4 text-center">
            Scan QR Code to Check In
          </h3>
          <QRCodeScanner
            onScan={handleScan}
            onError={handleScanError}
            className="mb-4"
          />
          {scanResult && (
            <div className={`p-4 rounded-lg ${
              scanResult.error
                ? 'bg-red-50 border border-red-200'
                : 'bg-green-50 border border-green-200'
            }`}>
              {scanResult.error ? (
                <div className="text-red-600">
                  <strong>Error:</strong> {scanResult.error}
                </div>
              ) : (
                <div className="text-green-600">
                  <strong>Success:</strong> Checked in at {new Date(scanResult.timestamp).toLocaleTimeString()}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div>
          {loading ? (
            <div className="text-center py-8">Generating QR Code...</div>
          ) : (
            <QRCodeDisplay
              data={qrCode}
              title="Your Check-in QR Code"
              size={250}
              refreshInterval={300} // 5 minutes
              onRefresh={generateEmployeeQR}
              className="text-center"
            />
          )}
          <div className="mt-4 text-sm text-gray-600 text-center">
            Present this QR code to check in at your workplace
          </div>
        </div>
      )}
    </div>
  );
};

export default QRCheckinSystem;
```

### 2. Location-Based Attendance

Create `components/attendance/LocationQRSystem.js`:

```javascript
import React, { useState, useEffect } from 'react';
import QRCodeDisplay from '../QRCodeDisplay';
import { QRCodeGenerator } from '../../utils/qrGenerator';

const LocationQRSystem = ({ locationId, locationName, isManager = false }) => {
  const [qrCode, setQrCode] = useState('');
  const [recentScans, setRecentScans] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    generateLocationQR();
    if (isManager) {
      fetchLocationStats();
      // Set up real-time updates
      const interval = setInterval(fetchRecentScans, 5000);
      return () => clearInterval(interval);
    }
  }, [locationId]);

  const generateLocationQR = async () => {
    try {
      const qrData = await QRCodeGenerator.generateLocationQR(locationId, locationName);
      setQrCode(qrData);
    } catch (error) {
      console.error('Failed to generate location QR:', error);
    }
  };

  const fetchLocationStats = async () => {
    try {
      const response = await fetch(`/api/locations/${locationId}/stats`);
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Failed to fetch location stats:', error);
    }
  };

  const fetchRecentScans = async () => {
    try {
      const response = await fetch(`/api/locations/${locationId}/recent-scans`);
      const data = await response.json();
      setRecentScans(data);
    } catch (error) {
      console.error('Failed to fetch recent scans:', error);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4">{locationName}</h2>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* QR Code Display */}
        <div>
          <QRCodeDisplay
            data={qrCode}
            title="Location Check-in"
            size={300}
            className="text-center"
          />
          <div className="mt-4 text-sm text-gray-600 text-center">
            Employees can scan this QR code to check in at this location
          </div>
        </div>

        {/* Manager Dashboard */}
        {isManager && (
          <div className="space-y-6">
            {/* Location Stats */}
            {stats && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Today's Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {stats.todayCheckins}
                    </div>
                    <div className="text-sm text-gray-600">Check-ins</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">
                      {stats.currentlyPresent}
                    </div>
                    <div className="text-sm text-gray-600">Present</div>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Scans */}
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-semibold mb-3">Recent Check-ins</h3>
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {recentScans.map((scan, index) => (
                  <div key={index} className="flex justify-between items-center py-2 px-3 bg-white rounded">
                    <span className="font-medium">{scan.employeeName}</span>
                    <span className="text-sm text-gray-600">
                      {new Date(scan.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                ))}
                {recentScans.length === 0 && (
                  <div className="text-gray-500 text-center py-4">
                    No recent check-ins
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationQRSystem;
```

## Advanced Features

### 1. QR Code with Logo

```javascript
import { QRCodeGenerator } from '../../utils/qrGenerator';

const generateQRWithLogo = async (data, logoUrl) => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Generate base QR code
  const qrDataURL = await QRCodeGenerator.generateDataURL(data, { width: 300 });

  // Load QR code image
  const qrImage = new Image();
  qrImage.onload = () => {
    canvas.width = qrImage.width;
    canvas.height = qrImage.height;

    // Draw QR code
    ctx.drawImage(qrImage, 0, 0);

    // Load and draw logo
    const logo = new Image();
    logo.onload = () => {
      const logoSize = qrImage.width * 0.2; // 20% of QR code size
      const logoX = (qrImage.width - logoSize) / 2;
      const logoY = (qrImage.height - logoSize) / 2;

      // Draw white background for logo
      ctx.fillStyle = 'white';
      ctx.fillRect(logoX - 5, logoY - 5, logoSize + 10, logoSize + 10);

      // Draw logo
      ctx.drawImage(logo, logoX, logoY, logoSize, logoSize);
    };
    logo.src = logoUrl;
  };
  qrImage.src = qrDataURL;

  return canvas.toDataURL();
};
```

### 2. Batch QR Code Generation

```javascript
const generateBatchQRCodes = async (employees) => {
  const qrCodes = [];

  for (const employee of employees) {
    try {
      const qrData = await QRCodeGenerator.generateEmployeeQR(employee.id);
      qrCodes.push({
        employeeId: employee.id,
        employeeName: `${employee.firstName} ${employee.lastName}`,
        qrCode: qrData,
        generatedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error(`Failed to generate QR for employee ${employee.id}:`, error);
    }
  }

  return qrCodes;
};

// Export as PDF
const exportQRCodesToPDF = async (qrCodes) => {
  const { jsPDF } = await import('jspdf');
  const pdf = new jsPDF();

  let yPosition = 20;
  const pageHeight = pdf.internal.pageSize.height;

  for (const qrData of qrCodes) {
    if (yPosition > pageHeight - 100) {
      pdf.addPage();
      yPosition = 20;
    }

    // Add employee name
    pdf.setFontSize(12);
    pdf.text(qrData.employeeName, 20, yPosition);

    // Add QR code
    pdf.addImage(qrData.qrCode, 'PNG', 20, yPosition + 10, 50, 50);

    yPosition += 80;
  }

  pdf.save('employee-qr-codes.pdf');
};
```

## API Endpoints

### 1. QR Code Generation API

Create `pages/api/qr/generate.js`:

```javascript
import { QRCodeGenerator } from '../../../utils/qrGenerator';
import { withAuth } from '../../../middleware/auth';

async function generateQRHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { type, data, options = {} } = req.body;

  try {
    let qrCode;

    switch (type) {
      case 'employee_checkin':
        qrCode = await QRCodeGenerator.generateEmployeeQR(data.employeeId, data.expiresAt);
        break;

      case 'location_checkin':
        qrCode = await QRCodeGenerator.generateLocationQR(data.locationId, data.locationName);
        break;

      case 'document_access':
        qrCode = await QRCodeGenerator.generateDocumentQR(data.documentId, data.accessLevel);
        break;

      default:
        return res.status(400).json({ error: 'Invalid QR code type' });
    }

    res.json({
      qrCode,
      generatedAt: new Date().toISOString(),
      expiresAt: data.expiresAt || null
    });
  } catch (error) {
    console.error('QR generation error:', error);
    res.status(500).json({ error: 'Failed to generate QR code' });
  }
}

export default withAuth(generateQRHandler);
```

### 2. QR Code Processing API

Create `pages/api/qr/process.js`:

```javascript
import { QRCodeProcessor } from '../../../utils/qrProcessor';
import { withAuth } from '../../../middleware/auth';

async function processQRHandler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { qrData } = req.body;
  const userId = req.user.id;

  try {
    const validation = QRCodeProcessor.validateQRData(qrData);
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.error });
    }

    const { data } = validation;
    let result;

    switch (data.type) {
      case 'employee_checkin':
        result = await QRCodeProcessor.processEmployeeCheckin(data, userId);
        break;

      case 'location_checkin':
        result = await QRCodeProcessor.processLocationCheckin(data, userId);
        break;

      case 'document_access':
        result = await QRCodeProcessor.processDocumentAccess(data, userId);
        break;

      default:
        return res.status(400).json({ error: 'Unsupported QR code type' });
    }

    res.json(result);
  } catch (error) {
    console.error('QR processing error:', error);
    res.status(400).json({ error: error.message });
  }
}

export default withAuth(processQRHandler);
```

## Security Considerations

### 1. QR Code Security

```javascript
const secureQRGeneration = {
  // Add digital signature
  signQRData: (data, secretKey) => {
    const crypto = require('crypto');
    const signature = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(data))
      .digest('hex');

    return {
      ...data,
      signature
    };
  },

  // Verify signature
  verifyQRData: (data, secretKey) => {
    const { signature, ...payload } = data;
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(JSON.stringify(payload))
      .digest('hex');

    return signature === expectedSignature;
  },

  // Rate limiting
  rateLimitQRGeneration: new Map(),

  checkRateLimit: (userId) => {
    const now = Date.now();
    const userRequests = this.rateLimitQRGeneration.get(userId) || [];

    // Remove old requests (older than 1 minute)
    const recentRequests = userRequests.filter(time => now - time < 60000);

    if (recentRequests.length >= 10) {
      throw new Error('Rate limit exceeded');
    }

    recentRequests.push(now);
    this.rateLimitQRGeneration.set(userId, recentRequests);
  }
};
```

### 2. Secure QR Processing

```javascript
const secureQRProcessing = {
  // Prevent replay attacks
  processedQRs: new Set(),

  checkReplayAttack: (qrData) => {
    const qrHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(qrData))
      .digest('hex');

    if (this.processedQRs.has(qrHash)) {
      throw new Error('QR code already processed');
    }

    this.processedQRs.add(qrHash);

    // Clean up old hashes (keep for 1 hour)
    setTimeout(() => {
      this.processedQRs.delete(qrHash);
    }, 3600000);
  },

  // Validate geolocation (if applicable)
  validateLocation: async (qrData, userLocation) => {
    if (qrData.type === 'location_checkin' && qrData.coordinates) {
      const distance = calculateDistance(
        userLocation,
        qrData.coordinates
      );

      if (distance > 100) { // 100 meters tolerance
        throw new Error('Too far from location');
      }
    }
  }
};
```

## Testing QR Code Functionality

### 1. Unit Tests

```javascript
import { QRCodeGenerator } from '../utils/qrGenerator';
import { QRCodeProcessor } from '../utils/qrProcessor';

describe('QR Code Functionality', () => {
  describe('QRCodeGenerator', () => {
    test('generates valid employee QR code', async () => {
      const qrCode = await QRCodeGenerator.generateEmployeeQR('employee-123');
      expect(qrCode).toBeDefined();
      expect(qrCode).toMatch(/^data:image\/png;base64,/);
    });

    test('generates location QR code', async () => {
      const qrCode = await QRCodeGenerator.generateLocationQR('location-456', 'Main Office');
      expect(qrCode).toBeDefined();
    });
  });

  describe('QRCodeProcessor', () => {
    test('validates QR data correctly', () => {
      const validData = {
        type: 'employee_checkin',
        employeeId: 'emp-123',
        timestamp: Date.now()
      };

      const result = QRCodeProcessor.validateQRData(validData);
      expect(result.isValid).toBe(true);
    });

    test('rejects expired QR codes', () => {
      const expiredData = {
        type: 'employee_checkin',
        employeeId: 'emp-123',
        timestamp: Date.now(),
        expiresAt: Date.now() - 1000 // Expired 1 second ago
      };

      const result = QRCodeProcessor.validateQRData(expiredData);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('expired');
    });
  });
});
```

### 2. Integration Tests

```javascript
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import QRCheckinSystem from '../components/attendance/QRCheckinSystem';

// Mock camera access
Object.defineProperty(navigator, 'mediaDevices', {
  writable: true,
  value: {
    getUserMedia: jest.fn(() => Promise.resolve({}))
  }
});

describe('QR Check-in System', () => {
  test('switches between scan and generate modes', async () => {
    render(<QRCheckinSystem />);

    const generateButton = screen.getByText('Generate QR');
    await userEvent.click(generateButton);

    await waitFor(() => {
      expect(screen.getByText('Your Check-in QR Code')).toBeInTheDocument();
    });
  });
});
```

## Best Practices

1. **Always validate QR data** before processing
2. **Implement expiration times** for security
3. **Use HTTPS** for all QR-related communications
4. **Add rate limiting** to prevent abuse
5. **Include error handling** for camera access issues
6. **Test on different devices** and browsers
7. **Provide fallback options** when QR scanning fails
8. **Log QR usage** for audit purposes
9. **Implement proper permissions** for QR generation
10. **Consider offline scenarios** for critical functionality