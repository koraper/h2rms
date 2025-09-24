# PDF Generation Guide

This guide covers implementing PDF generation functionality in H2RMS for reports, payslips, and other documents.

## Overview

H2RMS supports PDF generation for:
- Attendance reports
- Leave summaries
- Employee profiles
- Payslips
- Department reports
- Custom documents

## Libraries and Setup

### 1. Install Dependencies

```bash
npm install jspdf html2canvas puppeteer react-pdf/renderer
# or for lighter alternative
npm install jspdf jspdf-autotable
```

### 2. Choose Your Approach

**Option A: Client-side with jsPDF**
- Lightweight
- Works in browser
- Limited styling options

**Option B: Server-side with Puppeteer**
- Full HTML/CSS support
- Better performance
- Requires server resources

**Option C: React PDF**
- Component-based
- Good for complex layouts
- Both client and server support

## Implementation Examples

### 1. Client-side PDF with jsPDF

Create `utils/pdfGenerator.js`:

```javascript
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export class PDFGenerator {
  constructor() {
    this.doc = new jsPDF();
    this.pageHeight = this.doc.internal.pageSize.height;
    this.margins = { top: 20, left: 20, right: 20, bottom: 20 };
  }

  addHeader(title, subtitle = '') {
    const { doc } = this;

    // Company logo (if available)
    // doc.addImage(logoData, 'PNG', 20, 10, 30, 20);

    // Title
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text(title, 20, 35);

    // Subtitle
    if (subtitle) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text(subtitle, 20, 45);
    }

    // Date
    const date = new Date().toLocaleDateString();
    doc.setFontSize(10);
    doc.text(`Generated: ${date}`, doc.internal.pageSize.width - 60, 20);

    // Line separator
    doc.setDrawColor(200, 200, 200);
    doc.line(20, 55, doc.internal.pageSize.width - 20, 55);

    return this;
  }

  addAttendanceReport(data, period) {
    const { doc } = this;

    this.addHeader('Attendance Report', `Period: ${period.start} - ${period.end}`);

    // Summary section
    let yPos = 70;
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Summary', 20, yPos);

    yPos += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');

    const summary = [
      `Total Employees: ${data.totalEmployees}`,
      `Total Working Days: ${data.totalWorkingDays}`,
      `Average Attendance: ${data.averageAttendance}%`,
      `Late Arrivals: ${data.lateArrivals}`,
      `Early Departures: ${data.earlyDepartures}`
    ];

    summary.forEach(item => {
      doc.text(item, 20, yPos);
      yPos += 8;
    });

    yPos += 10;

    // Attendance table
    const tableData = data.attendance.map(record => [
      record.employeeName,
      record.department,
      record.presentDays,
      record.absentDays,
      record.lateCount,
      record.attendancePercentage + '%'
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Employee', 'Department', 'Present', 'Absent', 'Late', 'Percentage']],
      body: tableData,
      styles: {
        fontSize: 9,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      }
    });

    return this;
  }

  addLeaveReport(data, period) {
    const { doc } = this;

    this.addHeader('Leave Report', `Period: ${period.start} - ${period.end}`);

    let yPos = 70;

    // Leave summary by type
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Leave Summary by Type', 20, yPos);

    yPos += 15;

    const leaveTypeData = Object.entries(data.leaveByType).map(([type, count]) => [
      type.charAt(0).toUpperCase() + type.slice(1),
      count
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Leave Type', 'Total Days']],
      body: leaveTypeData,
      styles: { fontSize: 10 },
      theme: 'grid'
    });

    yPos = doc.lastAutoTable.finalY + 20;

    // Individual leave records
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Leave Records', 20, yPos);

    yPos += 10;

    const leaveData = data.leaveRecords.map(record => [
      record.employeeName,
      record.leaveType,
      record.startDate,
      record.endDate,
      record.days,
      record.status
    ]);

    doc.autoTable({
      startY: yPos,
      head: [['Employee', 'Type', 'Start Date', 'End Date', 'Days', 'Status']],
      body: leaveData,
      styles: { fontSize: 9 },
      headStyles: {
        fillColor: [39, 174, 96],
        textColor: 255
      }
    });

    return this;
  }

  addEmployeeProfile(employee) {
    const { doc } = this;

    this.addHeader('Employee Profile', `${employee.firstName} ${employee.lastName}`);

    let yPos = 70;

    // Employee photo placeholder
    doc.setDrawColor(200, 200, 200);
    doc.rect(20, yPos, 40, 50);
    doc.setFontSize(8);
    doc.text('Photo', 35, yPos + 25);

    // Employee details
    const details = [
      `Employee ID: ${employee.id}`,
      `Email: ${employee.email}`,
      `Department: ${employee.department}`,
      `Role: ${employee.role}`,
      `Hire Date: ${employee.hireDate}`,
      `Phone: ${employee.phone || 'N/A'}`,
      `Address: ${employee.address || 'N/A'}`
    ];

    doc.setFontSize(11);
    let detailY = yPos;
    details.forEach(detail => {
      doc.text(detail, 70, detailY);
      detailY += 8;
    });

    return this;
  }

  addFooter() {
    const { doc } = this;
    const pageCount = doc.internal.getNumberOfPages();

    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);

      // Footer line
      doc.setDrawColor(200, 200, 200);
      doc.line(20, this.pageHeight - 30, doc.internal.pageSize.width - 20, this.pageHeight - 30);

      // Footer text
      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.text('H2RMS - Human Resources Management System', 20, this.pageHeight - 20);
      doc.text(`Page ${i} of ${pageCount}`, doc.internal.pageSize.width - 40, this.pageHeight - 20);
    }

    return this;
  }

  save(filename) {
    this.addFooter();
    this.doc.save(filename);
  }

  getBlob() {
    this.addFooter();
    return this.doc.output('blob');
  }

  getBase64() {
    this.addFooter();
    return this.doc.output('datauristring');
  }
}
```

### 2. Server-side PDF with Puppeteer

Create `pages/api/reports/pdf.js`:

```javascript
import puppeteer from 'puppeteer';
import { withAuth } from '../../../middleware/auth';

async function generatePDF(req, res) {
  const { type, data } = req.body;

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();

    // Generate HTML content based on type
    let html;
    switch (type) {
      case 'attendance':
        html = generateAttendanceHTML(data);
        break;
      case 'leave':
        html = generateLeaveHTML(data);
        break;
      case 'profile':
        html = generateProfileHTML(data);
        break;
      default:
        throw new Error('Invalid report type');
    }

    await page.setContent(html, { waitUntil: 'networkidle0' });

    const pdf = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    });

    await browser.close();

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-report.pdf"`);
    res.send(pdf);

  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ error: 'Failed to generate PDF' });
  }
}

function generateAttendanceHTML(data) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Attendance Report</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          color: #333;
        }

        .header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #2980b9;
          padding-bottom: 20px;
        }

        .header h1 {
          margin: 0;
          color: #2980b9;
        }

        .summary {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
          margin-bottom: 30px;
        }

        .summary-card {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border-left: 4px solid #2980b9;
        }

        .summary-card h3 {
          margin: 0 0 10px 0;
          color: #2c3e50;
        }

        .summary-card p {
          margin: 0;
          font-size: 18px;
          font-weight: bold;
          color: #2980b9;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }

        th {
          background-color: #2980b9;
          color: white;
        }

        tr:nth-child(even) {
          background-color: #f2f2f2;
        }

        .footer {
          margin-top: 30px;
          text-align: center;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Attendance Report</h1>
        <p>Period: ${data.period.start} - ${data.period.end}</p>
      </div>

      <div class="summary">
        <div class="summary-card">
          <h3>Total Employees</h3>
          <p>${data.totalEmployees}</p>
        </div>
        <div class="summary-card">
          <h3>Average Attendance</h3>
          <p>${data.averageAttendance}%</p>
        </div>
        <div class="summary-card">
          <h3>Late Arrivals</h3>
          <p>${data.lateArrivals}</p>
        </div>
        <div class="summary-card">
          <h3>Early Departures</h3>
          <p>${data.earlyDepartures}</p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Present Days</th>
            <th>Absent Days</th>
            <th>Late Count</th>
            <th>Percentage</th>
          </tr>
        </thead>
        <tbody>
          ${data.attendance.map(record => `
            <tr>
              <td>${record.employeeName}</td>
              <td>${record.department}</td>
              <td>${record.presentDays}</td>
              <td>${record.absentDays}</td>
              <td>${record.lateCount}</td>
              <td>${record.attendancePercentage}%</td>
            </tr>
          `).join('')}
        </tbody>
      </table>

      <div class="footer">
        <p>Generated on ${new Date().toLocaleDateString()} | H2RMS - Human Resources Management System</p>
      </div>
    </body>
    </html>
  `;
}

export default withAuth(generatePDF, 'manager');
```

### 3. React PDF Implementation

Create `components/reports/AttendancePDF.js`:

```javascript
import React from 'react';
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
  },
  header: {
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#2980b9',
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
    color: '#2980b9',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 12,
    color: '#666',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  summaryCard: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 5,
    width: '22%',
    borderLeftWidth: 4,
    borderLeftColor: '#2980b9',
  },
  summaryTitle: {
    fontSize: 10,
    marginBottom: 5,
    color: '#2c3e50',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2980b9',
  },
  table: {
    display: 'table',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderColor: '#ddd',
  },
  tableRow: {
    margin: 'auto',
    flexDirection: 'row',
  },
  tableColHeader: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
    backgroundColor: '#2980b9',
  },
  tableCol: {
    width: '16.66%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderColor: '#ddd',
  },
  tableCellHeader: {
    margin: 'auto',
    margin: 5,
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  tableCell: {
    margin: 'auto',
    margin: 5,
    fontSize: 9,
  },
});

const AttendancePDF = ({ data }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance Report</Text>
        <Text style={styles.subtitle}>
          Period: {data.period.start} - {data.period.end}
        </Text>
      </View>

      <View style={styles.summaryContainer}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Total Employees</Text>
          <Text style={styles.summaryValue}>{data.totalEmployees}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Average Attendance</Text>
          <Text style={styles.summaryValue}>{data.averageAttendance}%</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Late Arrivals</Text>
          <Text style={styles.summaryValue}>{data.lateArrivals}</Text>
        </View>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Early Departures</Text>
          <Text style={styles.summaryValue}>{data.earlyDepartures}</Text>
        </View>
      </View>

      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Employee</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Department</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Present</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Absent</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Late</Text>
          </View>
          <View style={styles.tableColHeader}>
            <Text style={styles.tableCellHeader}>Percentage</Text>
          </View>
        </View>

        {data.attendance.map((record, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.employeeName}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.department}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.presentDays}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.absentDays}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.lateCount}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{record.attendancePercentage}%</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
);

export default AttendancePDF;

// Usage in component
export const downloadAttendancePDF = async (data) => {
  const blob = await pdf(<AttendancePDF data={data} />).toBlob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance-report.pdf';
  link.click();
  URL.revokeObjectURL(url);
};
```

## Usage Examples

### 1. Generate Attendance Report

```javascript
import { PDFGenerator } from '../utils/pdfGenerator';

const generateAttendanceReport = async (attendanceData) => {
  const generator = new PDFGenerator();

  generator
    .addAttendanceReport(attendanceData, {
      start: '2024-01-01',
      end: '2024-01-31'
    })
    .save('attendance-report-january-2024.pdf');
};

// Usage in component
const handleExportPDF = () => {
  const data = {
    totalEmployees: 25,
    totalWorkingDays: 22,
    averageAttendance: 92,
    lateArrivals: 8,
    earlyDepartures: 3,
    attendance: [
      {
        employeeName: 'John Doe',
        department: 'Engineering',
        presentDays: 20,
        absentDays: 2,
        lateCount: 1,
        attendancePercentage: 91
      }
      // ... more records
    ]
  };

  generateAttendanceReport(data);
};
```

### 2. Server-side Generation

```javascript
// API endpoint usage
const exportReport = async (reportType, filters) => {
  const response = await fetch('/api/reports/pdf', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      type: reportType,
      data: filters
    })
  });

  if (response.ok) {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${reportType}-report.pdf`;
    a.click();
    window.URL.revokeObjectURL(url);
  }
};
```

## Styling and Customization

### 1. Custom Themes

```javascript
const themes = {
  default: {
    primaryColor: '#2980b9',
    secondaryColor: '#34495e',
    backgroundColor: '#ffffff',
    headerColor: '#2980b9'
  },
  corporate: {
    primaryColor: '#1a365d',
    secondaryColor: '#2d3748',
    backgroundColor: '#f7fafc',
    headerColor: '#1a365d'
  }
};

// Apply theme to PDF
generator.setTheme(themes.corporate);
```

### 2. Custom Fonts

```javascript
import { jsPDF } from 'jspdf';

// Add custom font
const addCustomFont = (doc) => {
  doc.addFileToVFS('CustomFont.ttf', customFontBase64);
  doc.addFont('CustomFont.ttf', 'CustomFont', 'normal');
  doc.setFont('CustomFont');
};
```

## Performance Optimization

### 1. Caching Generated PDFs

```javascript
const redis = require('redis');
const client = redis.createClient();

const getCachedPDF = async (cacheKey) => {
  const cached = await client.get(cacheKey);
  return cached ? Buffer.from(cached, 'base64') : null;
};

const cachePDF = async (cacheKey, pdfBuffer) => {
  await client.setex(cacheKey, 3600, pdfBuffer.toString('base64'));
};
```

### 2. Background Processing

```javascript
// Using a job queue (e.g., Bull)
import Queue from 'bull';

const pdfQueue = new Queue('pdf generation');

pdfQueue.process(async (job) => {
  const { type, data, userId } = job.data;

  // Generate PDF
  const pdfBuffer = await generatePDF(type, data);

  // Save to file system or cloud storage
  const filename = `${type}-${Date.now()}.pdf`;
  await saveToStorage(filename, pdfBuffer);

  // Notify user
  await notifyUser(userId, filename);
});

// Add job to queue
const queuePDFGeneration = (type, data, userId) => {
  pdfQueue.add({ type, data, userId });
};
```

## Testing PDF Generation

### 1. Unit Tests

```javascript
import { PDFGenerator } from '../utils/pdfGenerator';

describe('PDF Generation', () => {
  test('generates attendance report PDF', () => {
    const generator = new PDFGenerator();
    const mockData = {
      totalEmployees: 5,
      attendance: []
    };

    const pdf = generator
      .addAttendanceReport(mockData, { start: '2024-01-01', end: '2024-01-31' })
      .getBlob();

    expect(pdf).toBeDefined();
    expect(pdf.type).toBe('application/pdf');
  });
});
```

### 2. Integration Tests

```javascript
describe('PDF API', () => {
  test('generates PDF report via API', async () => {
    const response = await request(app)
      .post('/api/reports/pdf')
      .set('Authorization', `Bearer ${token}`)
      .send({
        type: 'attendance',
        data: mockData
      })
      .expect(200);

    expect(response.headers['content-type']).toBe('application/pdf');
  });
});
```

## Troubleshooting

### Common Issues

1. **Memory issues with large reports**: Use streaming or pagination
2. **Font loading errors**: Ensure fonts are properly embedded
3. **Layout breaking**: Test with different data sizes
4. **Performance issues**: Consider server-side generation for complex PDFs

### Best Practices

1. **Validate data before generation**
2. **Use appropriate PDF library for your needs**
3. **Implement proper error handling**
4. **Add loading states for user feedback**
5. **Cache generated PDFs when possible**
6. **Test with different browsers and devices**