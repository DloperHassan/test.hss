import { supabase } from '../../config/database';
import { Vehicle } from '../../types';

export class VehiclesService {
  async createVehicle(vehicleData: Partial<Vehicle>) {
    const { vehicle_name, type, registration_number, daily_rent_price, availability_status } = vehicleData;

    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('registration_number', registration_number)
      .maybeSingle();

    if (existingVehicle) {
      throw new Error('Vehicle with this registration number already exists');
    }

    const { data: newVehicle, error } = await supabase
      .from('vehicles')
      .insert({
        vehicle_name,
        type,
        registration_number,
        daily_rent_price,
        availability_status: availability_status || 'available'
      })
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return newVehicle;
  }

  async getAllVehicles() {
    const { data: vehicles, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return vehicles || [];
  }

  async getVehicleById(vehicleId: string) {
    const { data: vehicle, error } = await supabase
      .from('vehicles')
      .select('*')
      .eq('id', vehicleId)
      .maybeSingle();

    if (error) {
      throw new Error(error.message);
    }

    if (!vehicle) {
      throw new Error('Vehicle not found');
    }

    return vehicle;
  }

  async updateVehicle(vehicleId: string, vehicleData: Partial<Vehicle>) {
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', vehicleId)
      .maybeSingle();

    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    if (vehicleData.registration_number) {
      const { data: duplicateVehicle } = await supabase
        .from('vehicles')
        .select('id')
        .eq('registration_number', vehicleData.registration_number)
        .neq('id', vehicleId)
        .maybeSingle();

      if (duplicateVehicle) {
        throw new Error('Vehicle with this registration number already exists');
      }
    }

    const { data: updatedVehicle, error } = await supabase
      .from('vehicles')
      .update(vehicleData)
      .eq('id', vehicleId)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedVehicle;
  }

  async deleteVehicle(vehicleId: string) {
    const { data: existingVehicle } = await supabase
      .from('vehicles')
      .select('id')
      .eq('id', vehicleId)
      .maybeSingle();

    if (!existingVehicle) {
      throw new Error('Vehicle not found');
    }

    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('vehicle_id', vehicleId)
      .eq('status', 'active')
      .maybeSingle();

    if (activeBookings) {
      throw new Error('Cannot delete vehicle with active bookings');
    }

    const { error } = await supabase
      .from('vehicles')
      .delete()
      .eq('id', vehicleId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
