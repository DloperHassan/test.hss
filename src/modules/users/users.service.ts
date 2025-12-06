import bcrypt from 'bcrypt';
import { supabase } from '../../config/database';
import { User } from '../../types';

export class UsersService {
  async getAllUsers() {
    const { data: users, error } = await supabase
      .from('users')
      .select('id, name, email, phone, role, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return users || [];
  }

  async updateUser(userId: string, currentUserId: string, currentUserRole: string, updateData: Partial<User>) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!existingUser) {
      throw new Error('User not found');
    }

    const isAdmin = currentUserRole === 'admin';
    const isOwnProfile = userId === currentUserId;

    if (!isAdmin && !isOwnProfile) {
      throw new Error('Insufficient permissions');
    }

    if (updateData.role && !isAdmin) {
      throw new Error('Only admins can update user roles');
    }

    if (updateData.email) {
      const emailLower = updateData.email.toLowerCase();
      const { data: duplicateUser } = await supabase
        .from('users')
        .select('id')
        .eq('email', emailLower)
        .neq('id', userId)
        .maybeSingle();

      if (duplicateUser) {
        throw new Error('Email already in use');
      }

      updateData.email = emailLower;
    }

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', userId)
      .select('id, name, email, phone, role')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return updatedUser;
  }

  async deleteUser(userId: string) {
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .maybeSingle();

    if (!existingUser) {
      throw new Error('User not found');
    }

    const { data: activeBookings } = await supabase
      .from('bookings')
      .select('id')
      .eq('customer_id', userId)
      .eq('status', 'active')
      .maybeSingle();

    if (activeBookings) {
      throw new Error('Cannot delete user with active bookings');
    }

    const { error } = await supabase
      .from('users')
      .delete()
      .eq('id', userId);

    if (error) {
      throw new Error(error.message);
    }

    return true;
  }
}
