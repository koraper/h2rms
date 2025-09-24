# Chart Implementation Guide

This guide covers implementing interactive charts and data visualizations in H2RMS using various charting libraries.

## Overview

H2RMS includes charts for visualizing:
- Attendance trends
- Leave patterns
- Department statistics
- Performance metrics
- Workforce analytics
- Real-time dashboards

## Chart Libraries Comparison

| Library | Pros | Cons | Best For |
|---------|------|------|----------|
| Chart.js | Simple, lightweight | Limited customization | Basic charts |
| Recharts | React-friendly, responsive | React only | React projects |
| D3.js | Highly customizable | Steep learning curve | Complex visualizations |
| ApexCharts | Modern, interactive | Larger bundle size | Professional dashboards |
| Victory | React native support | Limited chart types | Cross-platform |

## Setup and Installation

### 1. Install Chart Libraries

```bash
# Option 1: Chart.js (Recommended for simplicity)
npm install chart.js react-chartjs-2

# Option 2: Recharts (React-specific)
npm install recharts

# Option 3: ApexCharts (Feature-rich)
npm install apexcharts react-apexcharts

# Option 4: D3.js (Maximum flexibility)
npm install d3
```

### 2. Base Chart Component

Create `components/charts/BaseChart.js`:

```javascript
import React from 'react';
import { Chart as ChartJS, registerables } from 'chart.js';
import { Chart } from 'react-chartjs-2';

ChartJS.register(...registerables);

const BaseChart = ({
  type,
  data,
  options = {},
  width,
  height,
  className = ''
}) => {
  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Chart Title'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
    plugins: {
      ...defaultOptions.plugins,
      ...options.plugins
    }
  };

  return (
    <div className={`chart-container ${className}`}>
      <Chart
        type={type}
        data={data}
        options={mergedOptions}
        width={width}
        height={height}
      />
    </div>
  );
};

export default BaseChart;
```

## Chart Implementations

### 1. Attendance Dashboard

Create `components/charts/AttendanceDashboard.js`:

```javascript
import React, { useState, useEffect } from 'react';
import BaseChart from './BaseChart';

const AttendanceDashboard = ({ timeRange = '30d' }) => {
  const [attendanceData, setAttendanceData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAttendanceData();
  }, [timeRange]);

  const fetchAttendanceData = async () => {
    try {
      const response = await fetch(`/api/reports/attendance-trends?range=${timeRange}`);
      const data = await response.json();
      setAttendanceData(data);
    } catch (error) {
      console.error('Failed to fetch attendance data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading charts...</div>;

  // Daily Attendance Trend
  const dailyTrendData = {
    labels: attendanceData.dailyTrends.map(d => d.date),
    datasets: [
      {
        label: 'Present',
        data: attendanceData.dailyTrends.map(d => d.present),
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
      },
      {
        label: 'Absent',
        data: attendanceData.dailyTrends.map(d => d.absent),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        fill: true,
      },
      {
        label: 'Late',
        data: attendanceData.dailyTrends.map(d => d.late),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        fill: true,
      }
    ]
  };

  // Department Comparison
  const departmentData = {
    labels: attendanceData.byDepartment.map(d => d.name),
    datasets: [{
      label: 'Attendance Rate (%)',
      data: attendanceData.byDepartment.map(d => d.attendanceRate),
      backgroundColor: [
        '#3b82f6',
        '#10b981',
        '#f59e0b',
        '#ef4444',
        '#8b5cf6',
        '#ec4899'
      ]
    }]
  };

  // Weekly Pattern
  const weeklyPatternData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    datasets: [{
      label: 'Average Attendance',
      data: attendanceData.weeklyPattern,
      backgroundColor: 'rgba(59, 130, 246, 0.8)',
      borderColor: '#3b82f6',
      borderWidth: 1
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Daily Trend Chart */}
      <div className="col-span-full">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Daily Attendance Trends</h3>
          <BaseChart
            type="line"
            data={dailyTrendData}
            options={{
              plugins: {
                title: {
                  display: false
                },
                legend: {
                  position: 'top'
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Employees'
                  }
                }
              }
            }}
            height={300}
          />
        </div>
      </div>

      {/* Department Comparison */}
      <div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Department Comparison</h3>
          <BaseChart
            type="bar"
            data={departmentData}
            options={{
              plugins: {
                title: { display: false },
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'Attendance Rate (%)'
                  }
                }
              }
            }}
            height={300}
          />
        </div>
      </div>

      {/* Weekly Pattern */}
      <div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Weekly Pattern</h3>
          <BaseChart
            type="bar"
            data={weeklyPatternData}
            options={{
              plugins: {
                title: { display: false },
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  max: 100,
                  title: {
                    display: true,
                    text: 'Attendance Rate (%)'
                  }
                }
              }
            }}
            height={300}
          />
        </div>
      </div>
    </div>
  );
};

export default AttendanceDashboard;
```

### 2. Leave Analytics

Create `components/charts/LeaveAnalytics.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';

const LeaveAnalytics = ({ year = new Date().getFullYear() }) => {
  const [leaveData, setLeaveData] = useState(null);

  useEffect(() => {
    fetchLeaveData();
  }, [year]);

  const fetchLeaveData = async () => {
    try {
      const response = await fetch(`/api/reports/leave-analytics?year=${year}`);
      const data = await response.json();
      setLeaveData(data);
    } catch (error) {
      console.error('Failed to fetch leave data:', error);
    }
  };

  if (!leaveData) return <div>Loading...</div>;

  // Leave Types Distribution
  const leaveTypesData = {
    labels: Object.keys(leaveData.byType),
    datasets: [{
      data: Object.values(leaveData.byType),
      backgroundColor: [
        '#3b82f6', // Blue
        '#10b981', // Green
        '#f59e0b', // Yellow
        '#ef4444', // Red
        '#8b5cf6', // Purple
        '#ec4899'  // Pink
      ]
    }]
  };

  // Monthly Leave Trends
  const monthlyTrendsData = {
    labels: [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ],
    datasets: [
      {
        label: 'Sick Leave',
        data: leaveData.monthlyTrends.sick,
        backgroundColor: '#ef4444'
      },
      {
        label: 'Vacation',
        data: leaveData.monthlyTrends.vacation,
        backgroundColor: '#10b981'
      },
      {
        label: 'Personal',
        data: leaveData.monthlyTrends.personal,
        backgroundColor: '#f59e0b'
      }
    ]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Leave Types Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Leave Types Distribution</h3>
          <div style={{ height: '300px' }}>
            <Doughnut
              data={leaveTypesData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'right'
                  }
                }
              }}
            />
          </div>
        </div>

        {/* Leave Statistics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Leave Statistics</h3>
          <div className="space-y-4">
            <div className="flex justify-between">
              <span>Total Leave Days:</span>
              <span className="font-bold">{leaveData.statistics.totalDays}</span>
            </div>
            <div className="flex justify-between">
              <span>Average per Employee:</span>
              <span className="font-bold">{leaveData.statistics.averagePerEmployee}</span>
            </div>
            <div className="flex justify-between">
              <span>Most Common Type:</span>
              <span className="font-bold">{leaveData.statistics.mostCommonType}</span>
            </div>
            <div className="flex justify-between">
              <span>Approval Rate:</span>
              <span className="font-bold text-green-600">{leaveData.statistics.approvalRate}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trends */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Monthly Leave Trends</h3>
        <Bar
          data={monthlyTrendsData}
          options={{
            responsive: true,
            scales: {
              x: {
                stacked: true
              },
              y: {
                stacked: true,
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Number of Days'
                }
              }
            }
          }}
          height={100}
        />
      </div>
    </div>
  );
};

export default LeaveAnalytics;
```

### 3. Real-time Dashboard

Create `components/charts/RealtimeDashboard.js`:

```javascript
import React, { useState, useEffect, useRef } from 'react';
import BaseChart from './BaseChart';

const RealtimeDashboard = () => {
  const [realtimeData, setRealtimeData] = useState({
    currentAttendance: 0,
    checkInsToday: [],
    liveUpdates: []
  });
  const intervalRef = useRef();

  useEffect(() => {
    // Initial data load
    fetchRealtimeData();

    // Set up polling for real-time updates
    intervalRef.current = setInterval(fetchRealtimeData, 30000); // 30 seconds

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const fetchRealtimeData = async () => {
    try {
      const response = await fetch('/api/dashboard/realtime');
      const data = await response.json();

      setRealtimeData(prevData => ({
        ...data,
        liveUpdates: [...prevData.liveUpdates, ...data.newUpdates].slice(-50) // Keep last 50 updates
      }));
    } catch (error) {
      console.error('Failed to fetch realtime data:', error);
    }
  };

  // Check-ins throughout the day
  const checkInData = {
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`),
    datasets: [{
      label: 'Check-ins',
      data: realtimeData.checkInsToday,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Current Status Cards */}
      <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-green-600">
            {realtimeData.currentAttendance}
          </div>
          <div className="text-sm text-gray-600">Currently Present</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-blue-600">
            {realtimeData.todayCheckIns}
          </div>
          <div className="text-sm text-gray-600">Today's Check-ins</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-yellow-600">
            {realtimeData.lateArrivals}
          </div>
          <div className="text-sm text-gray-600">Late Arrivals</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow text-center">
          <div className="text-3xl font-bold text-red-600">
            {realtimeData.pendingLeaves}
          </div>
          <div className="text-sm text-gray-600">Pending Leaves</div>
        </div>
      </div>

      {/* Check-in Pattern Chart */}
      <div className="lg:col-span-2">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Today's Check-in Pattern</h3>
          <BaseChart
            type="line"
            data={checkInData}
            options={{
              plugins: {
                title: { display: false },
                legend: { display: false }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  title: {
                    display: true,
                    text: 'Number of Check-ins'
                  }
                }
              },
              animation: {
                duration: 0 // Disable animation for real-time updates
              }
            }}
            height={250}
          />
        </div>
      </div>

      {/* Live Activity Feed */}
      <div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Live Activity</h3>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {realtimeData.liveUpdates.map((update, index) => (
              <div key={index} className="flex items-center space-x-2 text-sm">
                <div className={`w-2 h-2 rounded-full ${getStatusColor(update.type)}`}></div>
                <span className="text-gray-600">{update.time}</span>
                <span>{update.message}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const getStatusColor = (type) => {
  const colors = {
    'check-in': 'bg-green-500',
    'check-out': 'bg-blue-500',
    'leave-request': 'bg-yellow-500',
    'late': 'bg-red-500'
  };
  return colors[type] || 'bg-gray-500';
};

export default RealtimeDashboard;
```

### 4. Performance Metrics

Create `components/charts/PerformanceMetrics.js`:

```javascript
import React, { useState, useEffect } from 'react';
import { Radar, Line } from 'react-chartjs-2';

const PerformanceMetrics = ({ employeeId, timeRange = '6m' }) => {
  const [performanceData, setPerformanceData] = useState(null);

  useEffect(() => {
    fetchPerformanceData();
  }, [employeeId, timeRange]);

  const fetchPerformanceData = async () => {
    try {
      const response = await fetch(`/api/reports/performance?employee=${employeeId}&range=${timeRange}`);
      const data = await response.json();
      setPerformanceData(data);
    } catch (error) {
      console.error('Failed to fetch performance data:', error);
    }
  };

  if (!performanceData) return <div>Loading...</div>;

  // Performance Radar Chart
  const radarData = {
    labels: [
      'Attendance',
      'Punctuality',
      'Project Completion',
      'Team Collaboration',
      'Goal Achievement',
      'Skill Development'
    ],
    datasets: [{
      label: 'Current Period',
      data: performanceData.current,
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      borderColor: '#3b82f6',
      pointBackgroundColor: '#3b82f6'
    }, {
      label: 'Previous Period',
      data: performanceData.previous,
      backgroundColor: 'rgba(156, 163, 175, 0.2)',
      borderColor: '#9ca3af',
      pointBackgroundColor: '#9ca3af'
    }]
  };

  // Performance Trend
  const trendData = {
    labels: performanceData.trend.labels,
    datasets: [{
      label: 'Performance Score',
      data: performanceData.trend.scores,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      fill: true,
      tension: 0.4
    }]
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Radar */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Performance Overview</h3>
          <Radar
            data={radarData}
            options={{
              scales: {
                r: {
                  beginAtZero: true,
                  max: 100
                }
              }
            }}
            height={300}
          />
        </div>

        {/* KPI Cards */}
        <div className="space-y-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Key Performance Indicators</h3>
            <div className="grid grid-cols-2 gap-4">
              {performanceData.kpis.map((kpi, index) => (
                <div key={index} className="text-center">
                  <div className={`text-2xl font-bold ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.value}
                  </div>
                  <div className="text-sm text-gray-600">{kpi.label}</div>
                  <div className={`text-xs ${kpi.trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend > 0 ? '↑' : '↓'} {Math.abs(kpi.trend)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Trend */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">Performance Trend</h3>
        <Line
          data={trendData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
                max: 100,
                title: {
                  display: true,
                  text: 'Performance Score'
                }
              }
            }
          }}
          height={100}
        />
      </div>
    </div>
  );
};

export default PerformanceMetrics;
```

## Advanced Chart Features

### 1. Interactive Charts

```javascript
const InteractiveChart = ({ data }) => {
  const [selectedDataPoint, setSelectedDataPoint] = useState(null);

  const chartOptions = {
    onClick: (event, elements) => {
      if (elements.length > 0) {
        const dataIndex = elements[0].index;
        setSelectedDataPoint(data.datasets[0].data[dataIndex]);
      }
    },
    onHover: (event, elements) => {
      event.native.target.style.cursor = elements.length > 0 ? 'pointer' : 'default';
    }
  };

  return (
    <div>
      <BaseChart data={data} options={chartOptions} />
      {selectedDataPoint && (
        <div className="mt-4 p-4 bg-blue-50 rounded">
          Selected value: {selectedDataPoint}
        </div>
      )}
    </div>
  );
};
```

### 2. Custom Chart Components

```javascript
import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const CustomGanttChart = ({ tasks, width = 800, height = 400 }) => {
  const svgRef = useRef();

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 20, bottom: 30, left: 100 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleTime()
      .domain(d3.extent(tasks.flatMap(d => [d.startDate, d.endDate])))
      .range([0, innerWidth]);

    const yScale = d3.scaleBand()
      .domain(tasks.map(d => d.name))
      .range([0, innerHeight])
      .padding(0.1);

    const g = svg.append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    g.selectAll('.task-bar')
      .data(tasks)
      .enter()
      .append('rect')
      .attr('class', 'task-bar')
      .attr('x', d => xScale(d.startDate))
      .attr('y', d => yScale(d.name))
      .attr('width', d => xScale(d.endDate) - xScale(d.startDate))
      .attr('height', yScale.bandwidth())
      .attr('fill', d => d.color || '#3b82f6');

    // Add axes
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale));

    g.append('g')
      .call(d3.axisLeft(yScale));
  }, [tasks, width, height]);

  return <svg ref={svgRef} width={width} height={height}></svg>;
};
```

### 3. Chart Export Functionality

```javascript
const ExportableChart = ({ chartRef, filename = 'chart' }) => {
  const exportChartAsPNG = () => {
    const canvas = chartRef.current.canvas;
    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${filename}.png`;
    link.href = url;
    link.click();
  };

  const exportChartAsPDF = async () => {
    const canvas = chartRef.current.canvas;
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = await import('jspdf');
    const pdf = new jsPDF();

    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`${filename}.pdf`);
  };

  return (
    <div className="flex space-x-2">
      <button
        onClick={exportChartAsPNG}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Export as PNG
      </button>
      <button
        onClick={exportChartAsPDF}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Export as PDF
      </button>
    </div>
  );
};
```

## Responsive Design

### 1. Responsive Chart Container

```javascript
import { useEffect, useState } from 'react';

const ResponsiveChartContainer = ({ children }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height
        });
      }
    });

    const container = document.getElementById('chart-container');
    if (container) {
      resizeObserver.observe(container);
    }

    return () => resizeObserver.disconnect();
  }, []);

  return (
    <div id="chart-container" className="w-full h-full">
      {React.cloneElement(children, dimensions)}
    </div>
  );
};
```

### 2. Mobile-Optimized Charts

```javascript
const MobileChart = ({ data, isMobile }) => {
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: !isMobile,
        position: isMobile ? 'bottom' : 'top'
      }
    },
    scales: {
      x: {
        ticks: {
          maxRotation: isMobile ? 90 : 0
        }
      }
    }
  };

  return (
    <BaseChart
      data={data}
      options={options}
      height={isMobile ? 250 : 400}
    />
  );
};
```

## Performance Optimization

### 1. Chart Lazy Loading

```javascript
import { lazy, Suspense } from 'react';

const LazyChart = lazy(() => import('./HeavyChart'));

const ChartContainer = ({ shouldLoad }) => {
  if (!shouldLoad) {
    return <div>Chart will load when visible</div>;
  }

  return (
    <Suspense fallback={<div>Loading chart...</div>}>
      <LazyChart />
    </Suspense>
  );
};
```

### 2. Data Virtualization for Large Datasets

```javascript
const VirtualizedChart = ({ data }) => {
  const [visibleData, setVisibleData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 100;

  useEffect(() => {
    const start = currentPage * pageSize;
    const end = start + pageSize;
    setVisibleData(data.slice(start, end));
  }, [data, currentPage]);

  return (
    <div>
      <BaseChart data={visibleData} />
      <div className="flex justify-between mt-4">
        <button
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          disabled={currentPage === 0}
        >
          Previous
        </button>
        <span>Page {currentPage + 1}</span>
        <button
          onClick={() => setCurrentPage(prev => prev + 1)}
          disabled={(currentPage + 1) * pageSize >= data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};
```

## Testing Charts

### 1. Chart Component Tests

```javascript
import { render, screen } from '@testing-library/react';
import AttendanceDashboard from '../AttendanceDashboard';

// Mock Chart.js
jest.mock('react-chartjs-2', () => ({
  Chart: ({ data }) => <div data-testid="mock-chart">{JSON.stringify(data)}</div>,
  Line: ({ data }) => <div data-testid="line-chart">{JSON.stringify(data)}</div>,
  Bar: ({ data }) => <div data-testid="bar-chart">{JSON.stringify(data)}</div>
}));

describe('AttendanceDashboard', () => {
  test('renders charts with correct data', () => {
    render(<AttendanceDashboard />);

    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
  });
});
```

### 2. Chart Data Validation

```javascript
const validateChartData = (data) => {
  const errors = [];

  if (!data.labels || !Array.isArray(data.labels)) {
    errors.push('Invalid labels array');
  }

  if (!data.datasets || !Array.isArray(data.datasets)) {
    errors.push('Invalid datasets array');
  }

  data.datasets?.forEach((dataset, index) => {
    if (!Array.isArray(dataset.data)) {
      errors.push(`Dataset ${index} has invalid data array`);
    }
  });

  return errors;
};
```

## Best Practices

1. **Choose the right chart type** for your data
2. **Optimize performance** for large datasets
3. **Make charts accessible** with proper labels and colors
4. **Test on different screen sizes** and devices
5. **Implement proper error handling** for data loading failures
6. **Use consistent color schemes** across charts
7. **Add loading states** and empty data states
8. **Implement proper data caching** for better performance