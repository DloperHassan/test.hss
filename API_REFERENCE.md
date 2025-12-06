# 🌐 API Reference

← [Back to Main Documentation](README.md)

Complete API reference for the Vehicle Rental System with request/response specifications.

---

## 🔐 Authentication Endpoints

### 1. User Registration

**Access:** Public  
**Description:** Register a new user account

#### Endpoint
```
POST /api/v1/auth/signup
```

#### Request Body
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securePassword123",
  "phone": "01712345678",
  "role": "customer"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "01712345678",
    "role": "customer"
  }
}
```

---

### 2. User Login

**Access:** Public  
**Description:** Login and receive JWT authentication token

#### Endpoint
```
POST /api/v1/auth/signin
```

#### Request Body
```json
{
  "email": "john.doe@example.com",
  "password": "securePassword123"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "customer"
    }
  }
}
```

---

## 🚗 Vehicle Endpoints

### 3. Create Vehicle

**Access:** Admin only  
**Description:** Add a new vehicle to the system

#### Endpoint
```
POST /api/v1/vehicles
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "vehicle_name": "Toyota Camry 2024",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 50,
  "availability_status": "available"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Vehicle created successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 50,
    "availability_status": "available"
  }
}
```

---

### 4. Get All Vehicles

**Access:** Public  
**Description:** Retrieve all vehicles in the system

#### Endpoint
```
GET /api/v1/vehicles
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicles retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_name": "Toyota Camry 2024",
      "type": "car",
      "registration_number": "ABC-1234",
      "daily_rent_price": 50,
      "availability_status": "available"
    },
    {
      "id": 2,
      "vehicle_name": "Honda Civic 2023",
      "type": "car",
      "registration_number": "XYZ-5678",
      "daily_rent_price": 45,
      "availability_status": "available"
    }
  ]
}
```

#### Success Response - Empty List (200 OK)
```json
{
  "success": true,
  "message": "No vehicles found",
  "data": []
}
```

---

### 5. Get Vehicle by ID

**Access:** Public  
**Description:** Retrieve specific vehicle details

#### Endpoint
```
GET /api/v1/vehicles/:vehicleId
```

**Example:**
```
GET /api/v1/vehicles/2
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle retrieved successfully",
  "data": {
    "id": 2,
    "vehicle_name": "Honda Civic 2023",
    "type": "car",
    "registration_number": "XYZ-5678",
    "daily_rent_price": 45,
    "availability_status": "available"
  }
}
```

---

### 6. Update Vehicle

**Access:** Admin only  
**Description:** Update vehicle details, price, or availability status

#### Endpoint
```
PUT /api/v1/vehicles/:vehicleId
```

**Example:**
```
PUT /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "vehicle_name": "Toyota Camry 2024 Premium",
  "type": "car",
  "registration_number": "ABC-1234",
  "daily_rent_price": 55,
  "availability_status": "available"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle updated successfully",
  "data": {
    "id": 1,
    "vehicle_name": "Toyota Camry 2024 Premium",
    "type": "car",
    "registration_number": "ABC-1234",
    "daily_rent_price": 55,
    "availability_status": "available"
  }
}
```

---

### 7. Delete Vehicle

**Access:** Admin only  
**Description:** Delete a vehicle (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/vehicles/:vehicleId
```

**Example:**
```
DELETE /api/v1/vehicles/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Vehicle deleted successfully"
}
```

---

## 👥 User Endpoints

### 8. Get All Users

**Access:** Admin only  
**Description:** Retrieve all users in the system

#### Endpoint
```
GET /api/v1/users
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```
#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john.doe@example.com",
      "phone": "+1234567890",
      "role": "customer"
    },
    {
      "id": 2,
      "name": "Admin User",
      "email": "admin@example.com",
      "phone": "+0987654321",
      "role": "admin"
    }
  ]
}
```

---

### 9. Update User

**Access:** Admin or Own Profile  
**Description:** Admin can update any user's role or details. Customer can update own profile only

#### Endpoint
```
PUT /api/v1/users/:userId
```

**Example:**
```
PUT /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body (All fields optional)
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "phone": "+1234567899",
  "role": "admin"
}
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "id": 1,
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "phone": "+1234567899",
    "role": "customer"
  }
}
```

---

### 10. Delete User

**Access:** Admin only  
**Description:** Delete a user (only if no active bookings exist)

#### Endpoint
```
DELETE /api/v1/users/:userId
```

**Example:**
```
DELETE /api/v1/users/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK)
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

---

## 📅 Booking Endpoints

### 11. Create Booking

**Access:** Customer or Admin  
**Description:** Create a new booking with automatic price calculation and vehicle status update

#### Endpoint
```
POST /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body
```json
{
  "customer_id": 1,
  "vehicle_id": 2,
  "rent_start_date": "2024-01-15",
  "rent_end_date": "2024-01-20"
}
```

#### Success Response (201 Created)
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "active",
    "vehicle": {
      "vehicle_name": "Honda Civic 2023",
      "daily_rent_price": 45
    }
  }
}
```

---

### 12. Get All Bookings

**Access:** Role-based (Admin sees all, Customer sees own)  
**Description:** Retrieve bookings based on user role

#### Endpoint
```
GET /api/v1/bookings
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Success Response (200 OK) - Admin View
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "customer_id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "customer": {
        "name": "John Doe",
        "email": "john.doe@example.com"
      },
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678"
      }
    }
  ]
}
```

#### Success Response (200 OK) - Customer View
```json
{
  "success": true,
  "message": "Your bookings retrieved successfully",
  "data": [
    {
      "id": 1,
      "vehicle_id": 2,
      "rent_start_date": "2024-01-15",
      "rent_end_date": "2024-01-20",
      "total_price": 250,
      "status": "active",
      "vehicle": {
        "vehicle_name": "Honda Civic 2023",
        "registration_number": "XYZ-5678",
        "type": "car"
      }
    }
  ]
}
```

---

### 13. Update Booking

**Access:** Role-based  
**Description:** Update booking status based on user role and business rules

#### Endpoint
```
PUT /api/v1/bookings/:bookingId
```

**Example:**
```
PUT /api/v1/bookings/1
```

#### Request Headers
```
Authorization: Bearer <jwt_token>
```

#### Request Body - Customer Cancellation
```json
{
  "status": "cancelled"
}
```

#### Request Body - Admin Mark as Returned
```json
{
  "status": "returned"
}
```

#### Success Response (200 OK) - Cancelled
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "cancelled"
  }
}
```

#### Success Response (200 OK) - Returned
```json
{
  "success": true,
  "message": "Booking marked as returned. Vehicle is now available",
  "data": {
    "id": 1,
    "customer_id": 1,
    "vehicle_id": 2,
    "rent_start_date": "2024-01-15",
    "rent_end_date": "2024-01-20",
    "total_price": 250,
    "status": "returned",
    "vehicle": {
      "availability_status": "available"
    }
  }
}
```

---

## 📝 Common Response Patterns

### Standard Success Response Structure
```json
{
  "success": true,
  "message": "Operation description",
  "data": "Response data"
}
```

### Standard Error Response Structure
```json
{
  "success": false,
  "message": "Error description",
  "errors": "Error description"
}
```

### HTTP Status Codes Used
| Code | Meaning | Usage |
|------|---------|-------|
| 200 | OK | Successful GET, PUT, DELETE |
| 201 | Created | Successful POST (resource created) |
| 400 | Bad Request | Validation errors, invalid input |
| 401 | Unauthorized | Missing or invalid authentication token |
| 403 | Forbidden | Valid token but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Internal Server Error | Unexpected server errors |

---

## 🔒 Authentication Header Format

All protected endpoints require the following header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

---

## 💡 Business Logic Notes

### Booking Price Calculation
```
total_price = daily_rent_price × number_of_days
number_of_days = rent_end_date - rent_start_date
```

### Vehicle Availability Updates
- When booking is created → Vehicle status changes to `"booked"`
- When booking is marked as `"returned"` → Vehicle status changes to `"available"`
- When booking is `"cancelled"` → Vehicle status changes to `"available"`

### Auto-Return Logic
- System automatically marks bookings as `"returned"` when `rent_end_date` has passed
- Vehicle availability status is updated accordingly

### Deletion Constraints
- Users cannot be deleted if they have active bookings
- Vehicles cannot be deleted if they have active bookings
- Active bookings = bookings with status `"active"`
