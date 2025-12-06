import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { supabase } from '../../config/database';
import { config } from '../../config/env';
import { AuthRequest } from '../../types';

export class AuthService {
  async signup(userData: AuthRequest) {
    const { name, email, password, phone, role = 'customer' } = userData;

    const emailLower = email.toLowerCase();

    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('email', emailLower)
      .maybeSingle();

    if (existingUser) {
      throw new Error('Email already registered');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error } = await supabase
      .from('users')
      .insert({
        name,
        email: emailLower,
        password: hashedPassword,
        phone,
        role
      })
      .select('id, name, email, phone, role')
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return newUser;
  }

  async signin(email: string, password: string) {
    const emailLower = email.toLowerCase();

    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', emailLower)
      .maybeSingle();

    if (error || !user) {
      throw new Error('Invalid email or password');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        role: user.role
      },
      config.jwtSecret,
      { expiresIn: config.jwtExpiresIn } as any
    );

    const { password: _, ...userWithoutPassword } = user;

    return {
      token,
      user: userWithoutPassword
    };
  }
}
