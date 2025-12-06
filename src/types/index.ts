export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  role: 'admin' | 'customer';
  created_at?: string;
}

export interface Vehicle {
  id: string;
  vehicle_name: string;
  type: 'car' | 'bike' | 'van' | 'SUV';
  registration_number: string;
  daily_rent_price: number;
  availability_status: 'available' | 'booked';
  created_at?: string;
}

export interface Booking {
  id: string;
  customer_id: string;
  vehicle_id: string;
  rent_start_date: string;
  rent_end_date: string;
  total_price: number;
  status: 'active' | 'cancelled' | 'returned';
  created_at?: string;
}

export interface AuthRequest {
  name?: string;
  email: string;
  password: string;
  phone?: string;
  role?: 'admin' | 'customer';
}

export interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}
