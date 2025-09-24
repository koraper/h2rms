// Database types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department: string;
  hireDate: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'admin' | 'manager' | 'employee';

export interface Department {
  id: string;
  name: string;
  description?: string;
  managerId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  checkIn?: string;
  checkOut?: string;
  date: string;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'late' | 'half_day';

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: string;
  approvedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export type LeaveType = 'vacation' | 'sick' | 'personal' | 'maternity' | 'paternity' | 'emergency';
export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  error: string;
  message: string;
  statusCode: number;
}

// Form types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignUpFormData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  department: string;
}

export interface LeaveRequestFormData {
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
}

// Component props
export interface PageProps {
  params?: Record<string, string>;
  searchParams?: Record<string, string | string[]>;
}

export interface LayoutProps {
  children: React.ReactNode;
}

// Chart data types
export interface ChartData {
  labels: string[];
  datasets: ChartDataset[];
}

export interface ChartDataset {
  label: string;
  data: number[];
  backgroundColor?: string | string[];
  borderColor?: string;
  fill?: boolean;
}

// Report types
export interface AttendanceReport {
  period: {
    start: string;
    end: string;
  };
  totalEmployees: number;
  totalWorkingDays: number;
  averageAttendance: number;
  lateArrivals: number;
  earlyDepartures: number;
  attendance: AttendanceReportItem[];
}

export interface AttendanceReportItem {
  employeeId: string;
  employeeName: string;
  department: string;
  presentDays: number;
  absentDays: number;
  lateCount: number;
  attendancePercentage: number;
}

// QR Code types
export interface QRCodeData {
  type: QRCodeType;
  employeeId?: string;
  locationId?: string;
  documentId?: string;
  timestamp: number;
  expiresAt?: number;
}

export type QRCodeType = 'employee_checkin' | 'location_checkin' | 'document_access';