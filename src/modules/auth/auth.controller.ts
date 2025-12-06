import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess, sendError } from '../../utils/response';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  signup = async (req: Request, res: Response) => {
    try {
      const { name, email, password, phone, role } = req.body;

      if (!name || !email || !password || !phone) {
        return sendError(res, 400, 'Name, email, password, and phone are required');
      }

      if (password.length < 6) {
        return sendError(res, 400, 'Password must be at least 6 characters long');
      }

      const user = await this.authService.signup({ name, email, password, phone, role });

      return sendSuccess(res, 201, 'User registered successfully', user);
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };

  signin = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return sendError(res, 400, 'Email and password are required');
      }

      const result = await this.authService.signin(email, password);

      return sendSuccess(res, 200, 'Login successful', result);
    } catch (error: any) {
      return sendError(res, 401, error.message);
    }
  };
}
