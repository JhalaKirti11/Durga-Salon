# Durga Salon Backend API

A comprehensive Node.js/Express backend API for the Durga Salon appointment booking system.

## Features

- **User Authentication**: JWT-based authentication system
- **Appointment Booking**: Complete appointment management system
- **Validation**: Comprehensive input validation and error handling
- **Database**: MongoDB with Mongoose ODM
- **Security**: CORS, input sanitization, and authentication middleware

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST `/api/auth/signup`
Register a new user account.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt_token_here",
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

#### POST `/api/auth/signin`
Sign in to existing account.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "token": "jwt_token_here",
  "_id": "user_id",
  "name": "John Doe",
  "email": "john@example.com"
}
```

### Appointment Routes (`/api/appointments`)

#### POST `/api/appointments/book`
Book a new appointment (public route).

**Request Body:**
```json
{
  "name": "Jane Smith",
  "email": "jane@example.com",
  "phone": "9876543210",
  "service": "haircut",
  "date": "2024-01-15",
  "time": "10:00 AM",
  "stylist": "priya",
  "notes": "Special styling request"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment booked successfully!",
  "data": {
    "_id": "appointment_id",
    "customerName": "Jane Smith",
    "customerEmail": "jane@example.com",
    "customerPhone": "9876543210",
    "service": "haircut",
    "serviceName": "Hair Cut & Styling",
    "servicePrice": "₹500",
    "serviceDuration": 60,
    "appointmentDate": "2024-01-15T00:00:00.000Z",
    "appointmentTime": "10:00 AM",
    "stylist": "priya",
    "stylistName": "Priya Sharma",
    "notes": "Special styling request",
    "status": "pending",
    "confirmationCode": "AP12345678ABCD",
    "totalAmount": 500,
    "bookingDate": "2024-01-10T10:30:00.000Z",
    "formattedDate": "Monday, January 15, 2024",
    "formattedTime": "10:00 AM"
  }
}
```

#### GET `/api/appointments/available-slots`
Get available time slots for a specific date.

**Query Parameters:**
- `date`: Date in YYYY-MM-DD format
- `stylist`: Stylist ID (optional, default: 'any')

**Example:**
```
GET /api/appointments/available-slots?date=2024-01-15&stylist=priya
```

**Response:**
```json
{
  "success": true,
  "data": {
    "date": "2024-01-15",
    "stylist": "priya",
    "availableSlots": [
      "09:00 AM",
      "09:30 AM",
      "10:30 AM",
      "11:00 AM"
    ]
  }
}
```

#### GET `/api/appointments/code/:confirmationCode`
Get appointment details by confirmation code.

**Example:**
```
GET /api/appointments/code/AP12345678ABCD
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "appointment_id",
    "customerName": "Jane Smith",
    "confirmationCode": "AP12345678ABCD",
    "status": "pending",
    "appointmentDate": "2024-01-15T00:00:00.000Z",
    "appointmentTime": "10:00 AM"
  }
}
```

#### GET `/api/appointments/user`
Get all appointments for the authenticated user.

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "appointment_id",
      "customerName": "Jane Smith",
      "serviceName": "Hair Cut & Styling",
      "appointmentDate": "2024-01-15T00:00:00.000Z",
      "appointmentTime": "10:00 AM",
      "status": "pending",
      "confirmationCode": "AP12345678ABCD"
    }
  ]
}
```

#### PUT `/api/appointments/cancel/:appointmentId`
Cancel an appointment (requires authentication).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment cancelled successfully",
  "data": {
    "_id": "appointment_id",
    "status": "cancelled"
  }
}
```

#### GET `/api/appointments/all`
Get all appointments (admin route).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Query Parameters:**
- `status`: Filter by status (pending, confirmed, completed, cancelled)
- `date`: Filter by date (YYYY-MM-DD)
- `stylist`: Filter by stylist
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)

**Response:**
```json
{
  "success": true,
  "data": {
    "appointments": [...],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalAppointments": 50,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

#### PUT `/api/appointments/status/:appointmentId`
Update appointment status (admin route).

**Headers:**
```
Authorization: Bearer <jwt_token>
```

**Request Body:**
```json
{
  "status": "confirmed"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Appointment status updated successfully",
  "data": {
    "_id": "appointment_id",
    "status": "confirmed"
  }
}
```

## Available Services

| Service ID | Service Name | Price | Duration |
|------------|--------------|-------|----------|
| haircut | Hair Cut & Styling | ₹500 | 60 min |
| haircolor | Hair Coloring | ₹1500 | 120 min |
| highlights | Highlights & Lowlights | ₹2000 | 150 min |
| facial | Facial & Skin Care | ₹800 | 90 min |
| manicure | Manicure | ₹600 | 45 min |
| pedicure | Pedicure | ₹700 | 60 min |
| manicure-pedicure | Manicure & Pedicure | ₹1200 | 90 min |
| hair-treatment | Hair Treatment | ₹1000 | 90 min |
| bridal | Bridal Package | ₹5000 | 240 min |

## Available Stylists

| Stylist ID | Stylist Name | Specialties |
|------------|--------------|-------------|
| priya | Priya Sharma | Hair Coloring, Styling |
| meera | Meera Patel | Facial, Skin Care |
| anjali | Anjali Singh | Hair Cut, Treatment |
| kavita | Kavita Verma | Manicure, Pedicure |
| any | Any Available Stylist | All Services |

## Time Slots

Available time slots from 9:00 AM to 7:30 PM in 30-minute intervals:
- 09:00 AM, 09:30 AM, 10:00 AM, 10:30 AM
- 11:00 AM, 11:30 AM, 12:00 PM, 12:30 PM
- 01:00 PM, 01:30 PM, 02:00 PM, 02:30 PM
- 03:00 PM, 03:30 PM, 04:00 PM, 04:30 PM
- 05:00 PM, 05:30 PM, 06:00 PM, 06:30 PM
- 07:00 PM, 07:30 PM

## Error Responses

All endpoints return consistent error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

Common HTTP status codes:
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (authentication required)
- `404`: Not Found (resource not found)
- `409`: Conflict (appointment conflict, duplicate booking)
- `500`: Internal Server Error

## Setup Instructions

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables:**
   Create a `.env` file:
   ```
   PORT=5001
   MONGO_URI=mongodb://localhost:27017/durga-salon
   JWT_SECRET=your-secret-key-here
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

## Database Schema

### User Model
- `name`: String (required)
- `email`: String (required, unique)
- `password`: String (required, hashed)
- `createdAt`: Date
- `updatedAt`: Date

### Appointment Model
- `customerName`: String (required)
- `customerEmail`: String (required)
- `customerPhone`: String (required, 10 digits)
- `service`: String (required, enum)
- `serviceName`: String (auto-generated)
- `servicePrice`: String (auto-generated)
- `serviceDuration`: Number (auto-generated)
- `appointmentDate`: Date (required)
- `appointmentTime`: String (required)
- `stylist`: String (enum)
- `stylistName`: String (auto-generated)
- `notes`: String (optional)
- `status`: String (enum: pending, confirmed, completed, cancelled)
- `userId`: ObjectId (optional, reference to User)
- `confirmationCode`: String (unique, auto-generated)
- `totalAmount`: Number (auto-generated)
- `bookingDate`: Date (auto-generated)
- `createdAt`: Date
- `updatedAt`: Date

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: Bcrypt password encryption
- **Input Validation**: Comprehensive validation for all inputs
- **CORS Protection**: Configured for frontend origin
- **Error Handling**: Proper error responses without sensitive data
- **Rate Limiting**: Can be added for production use

## Production Considerations

1. **Environment Variables**: Use proper environment variables for secrets
2. **HTTPS**: Enable HTTPS in production
3. **Rate Limiting**: Implement rate limiting for API endpoints
4. **Logging**: Add proper logging for monitoring
5. **Database Indexing**: Optimize database queries with proper indexes
6. **Backup**: Implement regular database backups
7. **Monitoring**: Add health check endpoints and monitoring 