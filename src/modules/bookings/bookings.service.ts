import { supabase } from '../../config/database';
import { Booking } from '../../types';

export class BookingsService {
  async createBooking(bookingData: Partial<Booking>) {
    const { customer_id, vehicle_id, rent_start_date, rent_end_date } = bookingData;

    const { data: vehicle, error: vehicleError } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicle_id)
      .maybeSingle();

    if (vehicleError || !vehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicle.availability_status === 'booked') {
      throw new Error('Vehicle is not available');
    }

    const { data: customer, error: customerError } = await supabase
      .from('users')
      .select('id')
      .eq('id', customer_id)
      .maybeSingle();

    if (customerError || !customer) {
      throw new Error('Customer not found');
    }

    const startDate = new Date(rent_start_date!);
    const endDate = new Date(rent_end_date!);

    if (endDate <= startDate) {
      throw new Error('End date must be after start date');
    }

    const durationInDays = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
    const totalPrice = vehicle.daily_rent_price * durationInDays;

    const { data: newBooking, error: bookingError } = await supabase
      .from('bookings')
      .insert({
        customer_id,
        vehicle_id,
        rent_start_date,
        rent_end_date,
        total_price: totalPrice,
        status: 'active'
      })
      .select(`
        *,
        vehicle:vehicles(vehicle_name, daily_rent_price)
      `)
      .single();

    if (bookingError) {
      throw new Error(bookingError.message);
    }

    await supabase
      .from('vehicles')
      .update({ availability_status: 'booked' })
      .eq('id', vehicle_id);

    return newBooking;
  }

  async getAllBookings(userId: string, userRole: string) {
    let query = supabase
      .from('bookings')
      .select(`
        *,
        customer:users(name, email),
        vehicle:vehicles(vehicle_name, registration_number, type)
      `)
      .order('created_at', { ascending: false });

    if (userRole !== 'admin') {
      query = query.eq('customer_id', userId);
    }

    const { data: bookings, error } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return bookings || [];
  }

  async updateBooking(bookingId: string, userId: string, userRole: string, updateData: Partial<Booking>) {
    const { data: existingBooking, error: fetchError } = await supabase
      .from('bookings')
      .select('*, vehicle:vehicles(*)')
      .eq('id', bookingId)
      .single();

    if (fetchError || !existingBooking) {
      throw new Error('Booking not found');
    }

    const isAdmin = userRole === 'admin';
    const isOwner = existingBooking.customer_id === userId;

    if (!isAdmin && !isOwner) {
      throw new Error('Insufficient permissions');
    }

    if (updateData.status === 'cancelled') {
      if (!isOwner && !isAdmin) {
        throw new Error('Only the customer or admin can cancel a booking');
      }

      if (existingBooking.status !== 'active') {
        throw new Error('Only active bookings can be cancelled');
      }

      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', bookingId)
        .select()
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      await supabase
        .from('vehicles')
        .update({ availability_status: 'available' })
        .eq('id', existingBooking.vehicle_id);

      return updatedBooking;
    }

    if (updateData.status === 'returned') {
      if (!isAdmin) {
        throw new Error('Only admins can mark bookings as returned');
      }

      if (existingBooking.status !== 'active') {
        throw new Error('Only active bookings can be marked as returned');
      }

      const { data: updatedBooking, error: updateError } = await supabase
        .from('bookings')
        .update({ status: 'returned' })
        .eq('id', bookingId)
        .select(`
          *,
          vehicle:vehicles(availability_status)
        `)
        .single();

      if (updateError) {
        throw new Error(updateError.message);
      }

      await supabase
        .from('vehicles')
        .update({ availability_status: 'available' })
        .eq('id', existingBooking.vehicle_id);

      return updatedBooking;
    }

    throw new Error('Invalid status update');
  }
}
