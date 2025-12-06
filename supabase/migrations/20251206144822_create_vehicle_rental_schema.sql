/*
  # Vehicle Rental System Database Schema

  ## Overview
  Complete database schema for the vehicle rental management system with user authentication,
  vehicle inventory management, and booking functionality.

  ## Tables Created

  ### 1. users
  Stores user account information with authentication credentials and role-based access.
  - `id` (uuid, primary key) - Auto-generated unique identifier
  - `name` (text) - User's full name
  - `email` (text, unique) - User's email address (lowercased)
  - `password` (text) - Bcrypt hashed password
  - `phone` (text) - User's phone number
  - `role` (text) - User role: 'admin' or 'customer'
  - `created_at` (timestamptz) - Account creation timestamp

  ### 2. vehicles
  Manages the vehicle inventory with pricing and availability tracking.
  - `id` (uuid, primary key) - Auto-generated unique identifier
  - `vehicle_name` (text) - Name/model of the vehicle
  - `type` (text) - Vehicle type: 'car', 'bike', 'van', or 'SUV'
  - `registration_number` (text, unique) - Vehicle registration plate number
  - `daily_rent_price` (numeric) - Daily rental rate (must be positive)
  - `availability_status` (text) - Status: 'available' or 'booked'
  - `created_at` (timestamptz) - Record creation timestamp

  ### 3. bookings
  Tracks vehicle rental bookings with pricing and status management.
  - `id` (uuid, primary key) - Auto-generated unique identifier
  - `customer_id` (uuid, foreign key) - References users table
  - `vehicle_id` (uuid, foreign key) - References vehicles table
  - `rent_start_date` (date) - Rental start date
  - `rent_end_date` (date) - Rental end date (must be after start date)
  - `total_price` (numeric) - Total rental cost (must be positive)
  - `status` (text) - Booking status: 'active', 'cancelled', or 'returned'
  - `created_at` (timestamptz) - Booking creation timestamp

  ## Security (Row Level Security)
  
  ### Users Table Policies
  1. Public can register (INSERT) new accounts
  2. Users can view their own profile
  3. Users can update their own profile
  4. Admins can view all users
  5. Admins can update any user
  6. Admins can delete users

  ### Vehicles Table Policies
  1. Anyone can view all vehicles (public access)
  2. Only admins can create vehicles
  3. Only admins can update vehicles
  4. Only admins can delete vehicles

  ### Bookings Table Policies
  1. Authenticated users can create bookings
  2. Customers can view their own bookings
  3. Admins can view all bookings
  4. Customers can cancel their own bookings
  5. Admins can update any booking

  ## Important Notes
  1. All passwords must be hashed with bcrypt before insertion
  2. Email addresses are stored in lowercase
  3. Vehicle availability automatically updates on booking creation/return
  4. Booking total_price is calculated: daily_rent_price × duration
  5. Foreign key constraints ensure data integrity
  6. Check constraints validate data ranges and enum values
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  password text NOT NULL,
  phone text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at timestamptz DEFAULT now()
);

-- Create vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  vehicle_name text NOT NULL,
  type text NOT NULL CHECK (type IN ('car', 'bike', 'van', 'SUV')),
  registration_number text UNIQUE NOT NULL,
  daily_rent_price numeric NOT NULL CHECK (daily_rent_price > 0),
  availability_status text NOT NULL DEFAULT 'available' CHECK (availability_status IN ('available', 'booked')),
  created_at timestamptz DEFAULT now()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  vehicle_id uuid NOT NULL REFERENCES vehicles(id) ON DELETE RESTRICT,
  rent_start_date date NOT NULL,
  rent_end_date date NOT NULL CHECK (rent_end_date > rent_start_date),
  total_price numeric NOT NULL CHECK (total_price > 0),
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'returned')),
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_vehicles_availability ON vehicles(availability_status);
CREATE INDEX IF NOT EXISTS idx_bookings_customer ON bookings(customer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vehicle ON bookings(vehicle_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- =====================
-- USERS TABLE POLICIES
-- =====================

-- Allow public registration (anyone can insert)
CREATE POLICY "Anyone can register"
  ON users FOR INSERT
  TO public
  WITH CHECK (true);

-- Users can view their own profile
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK (auth.uid() = id OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Only admins can delete users
CREATE POLICY "Admins can delete users"
  ON users FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ========================
-- VEHICLES TABLE POLICIES
-- ========================

-- Anyone can view vehicles (public access)
CREATE POLICY "Anyone can view vehicles"
  ON vehicles FOR SELECT
  TO public
  USING (true);

-- Only admins can create vehicles
CREATE POLICY "Admins can create vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Only admins can update vehicles
CREATE POLICY "Admins can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin')
  WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- Only admins can delete vehicles
CREATE POLICY "Admins can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ========================
-- BOOKINGS TABLE POLICIES
-- ========================

-- Authenticated users can create bookings
CREATE POLICY "Authenticated users can create bookings"
  ON bookings FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

-- Users can view their own bookings, admins can view all
CREATE POLICY "Users can view own bookings"
  ON bookings FOR SELECT
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Users can update their own bookings, admins can update all
CREATE POLICY "Users can update own bookings"
  ON bookings FOR UPDATE
  TO authenticated
  USING (
    customer_id = auth.uid() OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  )
  WITH CHECK (
    customer_id = auth.uid() OR 
    (SELECT role FROM users WHERE id = auth.uid()) = 'admin'
  );

-- Only admins can delete bookings
CREATE POLICY "Admins can delete bookings"
  ON bookings FOR DELETE
  TO authenticated
  USING ((SELECT role FROM users WHERE id = auth.uid()) = 'admin');