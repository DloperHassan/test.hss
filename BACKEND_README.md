# Vehicle Rental System - Backend

A comprehensive backend API for managing vehicle rentals with user authentication, role-based access control, and complete CRUD operations for vehicles, users, and bookings.

## Features

- JWT-based authentication with bcrypt password hashing
- Role-based authorization (Admin and Customer)
- Complete vehicle inventory management
- User account management
- Booking system with automatic pricing calculation
- PostgreSQL database with Supabase
- TypeScript for type safety
- RESTful API design

## Technology Stack

- Node.js
- TypeScript
- Express.js
- PostgreSQL (Supabase)
- JWT for authentication
- bcrypt for password hashing

## Project Structure

```
src/
├── config/
│   ├── database.ts       # Supabase client configuration
│   └── env.ts           # Environment configuration
├── middleware/
│   └── auth.ts          # Authentication & authorization middleware
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   ├── vehicles/
│   │   ├── vehicles.controller.ts
│   │   ├── vehicles.service.ts
│   │   └── vehicles.routes.ts
│   ├── users/
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.routes.ts
│   └── bookings/
│       ├── bookings.controller.ts
│       ├── bookings.service.ts
│       └── bookings.routes.ts
├── types/
│   └── index.ts         # TypeScript type definitions
├── utils/
│   └── response.ts      # Standard response utilities
├── app.ts               # Express app configuration
└── server.ts            # Server entry point
```

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the root directory:
```env
PORT=3000
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

SUPABASE_URL=your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
```

3. Build the project:
```bash
npm run build
```

## Running the Application

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### Authentication
- `POST /api/v1/auth/signup` - Register new user
- `POST /api/v1/auth/signin` - Login user

### Vehicles
- `POST /api/v1/vehicles` - Create vehicle (Admin only)
- `GET /api/v1/vehicles` - Get all vehicles (Public)
- `GET /api/v1/vehicles/:vehicleId` - Get vehicle by ID (Public)
- `PUT /api/v1/vehicles/:vehicleId` - Update vehicle (Admin only)
- `DELETE /api/v1/vehicles/:vehicleId` - Delete vehicle (Admin only)

### Users
- `GET /api/v1/users` - Get all users (Admin only)
- `PUT /api/v1/users/:userId` - Update user (Admin or own profile)
- `DELETE /api/v1/users/:userId` - Delete user (Admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking (Authenticated)
- `GET /api/v1/bookings` - Get bookings (Role-based access)
- `PUT /api/v1/bookings/:bookingId` - Update booking (Role-based access)

## Database Schema

### Users Table
- id (UUID)
- name (TEXT)
- email (TEXT, unique)
- password (TEXT, hashed)
- phone (TEXT)
- role (TEXT: 'admin' or 'customer')
- created_at (TIMESTAMP)

### Vehicles Table
- id (UUID)
- vehicle_name (TEXT)
- type (TEXT: 'car', 'bike', 'van', 'SUV')
- registration_number (TEXT, unique)
- daily_rent_price (NUMERIC)
- availability_status (TEXT: 'available' or 'booked')
- created_at (TIMESTAMP)

### Bookings Table
- id (UUID)
- customer_id (UUID, FK to users)
- vehicle_id (UUID, FK to vehicles)
- rent_start_date (DATE)
- rent_end_date (DATE)
- total_price (NUMERIC)
- status (TEXT: 'active', 'cancelled', 'returned')
- created_at (TIMESTAMP)

## Authentication

Protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## Business Logic

### Booking Creation
- Validates vehicle availability
- Calculates total price: `daily_rent_price × number_of_days`
- Updates vehicle status to "booked"

### Booking Cancellation
- Only customers or admins can cancel
- Only active bookings can be cancelled
- Updates vehicle status to "available"

### Booking Return
- Only admins can mark bookings as returned
- Updates vehicle status to "available"

### User/Vehicle Deletion
- Cannot delete users or vehicles with active bookings
- Ensures data integrity

## Security Features

- Passwords hashed with bcrypt
- JWT token authentication
- Role-based access control
- Row Level Security (RLS) in database
- Input validation
- Protected routes

## Error Handling

The API uses standard HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

All responses follow a standard format:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {} or "errors": {}
}
```

## Development

### Type Safety
The project uses TypeScript for compile-time type checking. Run type checking with:
```bash
npm run build
```

### Code Structure
- Controllers handle HTTP requests/responses
- Services contain business logic
- Routes define API endpoints
- Middleware handles authentication and authorization

## License

ISC
