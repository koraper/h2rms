# API Endpoints Reference

Complete reference for H2RMS API endpoints.

## Base URL

- **Development**: `http://localhost:3000/api`
- **Production**: `https://your-domain.com/api`

## Authentication

All API endpoints require authentication unless otherwise specified. Include the JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Users & Profiles

### Get Current User Profile

```http
GET /api/users/profile
```

**Response:**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "first_name": "John",
  "last_name": "Doe",
  "role": "employee",
  "department": "Engineering",
  "hire_date": "2024-01-15",
  "created_at": "2024-01-15T10:00:00Z",
  "updated_at": "2024-01-15T10:00:00Z"
}
```

### Update User Profile

```http
PUT /api/users/profile
```

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "department": "Engineering"
}
```

### Get All Users (Admin/Manager only)

```http
GET /api/users
```

**Query Parameters:**
- `department` - Filter by department
- `role` - Filter by role
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

## Departments

### Get All Departments

```http
GET /api/departments
```

**Response:**
```json
[
  {
    "id": "uuid",
    "name": "Engineering",
    "description": "Software development team",
    "manager_id": "uuid",
    "created_at": "2024-01-01T10:00:00Z",
    "updated_at": "2024-01-01T10:00:00Z"
  }
]
```

### Create Department (Admin only)

```http
POST /api/departments
```

**Request Body:**
```json
{
  "name": "Human Resources",
  "description": "HR department",
  "manager_id": "uuid"
}
```

### Update Department (Admin only)

```http
PUT /api/departments/:id
```

**Request Body:**
```json
{
  "name": "Human Resources",
  "description": "Updated description",
  "manager_id": "uuid"
}
```

### Delete Department (Admin only)

```http
DELETE /api/departments/:id
```

## Attendance

### Get User Attendance

```http
GET /api/attendance
```

**Query Parameters:**
- `start_date` - Start date (YYYY-MM-DD)
- `end_date` - End date (YYYY-MM-DD)
- `employee_id` - Specific employee (managers only)

**Response:**
```json
[
  {
    "id": "uuid",
    "employee_id": "uuid",
    "check_in": "2024-01-15T09:00:00Z",
    "check_out": "2024-01-15T17:30:00Z",
    "date": "2024-01-15",
    "status": "present",
    "notes": null,
    "created_at": "2024-01-15T09:00:00Z",
    "updated_at": "2024-01-15T17:30:00Z"
  }
]
```

### Check In

```http
POST /api/attendance/checkin
```

**Request Body:**
```json
{
  "notes": "Started work early today"
}
```

### Check Out

```http
POST /api/attendance/checkout
```

**Request Body:**
```json
{
  "notes": "Completed all tasks"
}
```

### Manual Attendance Entry (Manager/Admin only)

```http
POST /api/attendance
```

**Request Body:**
```json
{
  "employee_id": "uuid",
  "date": "2024-01-15",
  "check_in": "2024-01-15T09:00:00Z",
  "check_out": "2024-01-15T17:30:00Z",
  "status": "present",
  "notes": "Manual entry"
}
```

### Update Attendance (Manager/Admin only)

```http
PUT /api/attendance/:id
```

**Request Body:**
```json
{
  "check_in": "2024-01-15T09:00:00Z",
  "check_out": "2024-01-15T17:30:00Z",
  "status": "present",
  "notes": "Updated entry"
}
```

## Leave Requests

### Get Leave Requests

```http
GET /api/leave-requests
```

**Query Parameters:**
- `status` - Filter by status (pending, approved, rejected)
- `start_date` - Start date filter
- `end_date` - End date filter
- `employee_id` - Specific employee (managers only)

**Response:**
```json
[
  {
    "id": "uuid",
    "employee_id": "uuid",
    "leave_type": "vacation",
    "start_date": "2024-02-01",
    "end_date": "2024-02-05",
    "reason": "Family vacation",
    "status": "pending",
    "approved_by": null,
    "approved_at": null,
    "created_at": "2024-01-15T10:00:00Z",
    "updated_at": "2024-01-15T10:00:00Z"
  }
]
```

### Create Leave Request

```http
POST /api/leave-requests
```

**Request Body:**
```json
{
  "leave_type": "vacation",
  "start_date": "2024-02-01",
  "end_date": "2024-02-05",
  "reason": "Family vacation"
}
```

### Update Leave Request Status (Manager/Admin only)

```http
PUT /api/leave-requests/:id/status
```

**Request Body:**
```json
{
  "status": "approved",
  "notes": "Approved with conditions"
}
```

### Cancel Leave Request

```http
DELETE /api/leave-requests/:id
```

## Reports

### Attendance Report

```http
GET /api/reports/attendance
```

**Query Parameters:**
- `start_date` - Start date (required)
- `end_date` - End date (required)
- `department` - Filter by department
- `format` - Response format (json, pdf, csv)

### Leave Summary Report

```http
GET /api/reports/leave-summary
```

**Query Parameters:**
- `year` - Year (default: current year)
- `department` - Filter by department
- `format` - Response format (json, pdf, csv)

### Department Statistics

```http
GET /api/reports/department-stats
```

**Query Parameters:**
- `department` - Specific department
- `period` - Time period (month, quarter, year)

## File Operations

### Upload Profile Picture

```http
POST /api/upload/avatar
```

**Request:** Multipart form data with file field

**Response:**
```json
{
  "url": "https://your-bucket.supabase.co/storage/v1/object/public/avatars/uuid/avatar.jpg",
  "path": "avatars/uuid/avatar.jpg"
}
```

### Upload Document

```http
POST /api/upload/document
```

**Request:** Multipart form data with file field and metadata

**Response:**
```json
{
  "id": "uuid",
  "filename": "document.pdf",
  "url": "https://storage-url/document.pdf",
  "size": 1024000,
  "mime_type": "application/pdf"
}
```

## QR Code Generation

### Generate QR Code

```http
POST /api/qr/generate
```

**Request Body:**
```json
{
  "data": "employee-checkin-uuid",
  "type": "checkin",
  "size": 200
}
```

**Response:**
```json
{
  "qr_code": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "expires_at": "2024-01-15T18:00:00Z"
}
```

## Error Responses

All endpoints return errors in the following format:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input parameters",
    "details": {
      "field": "email",
      "message": "Invalid email format"
    }
  }
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `422` - Validation Error
- `500` - Internal Server Error

### Common Error Codes

- `UNAUTHORIZED` - Invalid or missing authentication
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Invalid input data
- `NOT_FOUND` - Resource not found
- `DUPLICATE_ENTRY` - Resource already exists
- `RATE_LIMIT_EXCEEDED` - Too many requests

## Rate Limiting

API endpoints are rate limited:

- **Authentication endpoints**: 5 requests per minute
- **General API**: 100 requests per minute
- **File uploads**: 10 requests per minute

Rate limit headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (starts at 1)
- `limit` - Items per page (max 100)

**Response Headers:**
```
X-Total-Count: 250
X-Total-Pages: 10
X-Current-Page: 1
X-Per-Page: 25
```

## Filtering and Sorting

Most list endpoints support:

**Filtering:**
- `filter[field]=value`
- `search=query` - Full-text search

**Sorting:**
- `sort=field` - Ascending
- `sort=-field` - Descending
- `sort=field1,-field2` - Multiple fields

## Webhooks

Configure webhooks for real-time updates:

### Webhook Events

- `user.created`
- `user.updated`
- `attendance.checked_in`
- `attendance.checked_out`
- `leave_request.created`
- `leave_request.approved`
- `leave_request.rejected`

### Webhook Payload

```json
{
  "event": "attendance.checked_in",
  "timestamp": "2024-01-15T09:00:00Z",
  "data": {
    "id": "uuid",
    "employee_id": "uuid",
    "check_in": "2024-01-15T09:00:00Z"
  }
}
```