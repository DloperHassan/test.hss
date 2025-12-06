import { Request, Response } from 'express';
import { UsersService } from './users.service';
import { sendSuccess, sendError } from '../../utils/response';

export class UsersController {
  private usersService: UsersService;

  constructor() {
    this.usersService = new UsersService();
  }

  getAllUsers = async (_req: Request, res: Response) => {
    try {
      const users = await this.usersService.getAllUsers();

      return sendSuccess(res, 200, 'Users retrieved successfully', users);
    } catch (error: any) {
      return sendError(res, 500, error.message);
    }
  };

  updateUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const updateData = req.body;

      if (!req.user) {
        return sendError(res, 401, 'Authentication required');
      }

      const user = await this.usersService.updateUser(
        userId,
        req.user.userId,
        req.user.role,
        updateData
      );

      return sendSuccess(res, 200, 'User updated successfully', user);
    } catch (error: any) {
      if (error.message === 'Insufficient permissions') {
        return sendError(res, 403, error.message);
      }
      return sendError(res, 400, error.message);
    }
  };

  deleteUser = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      await this.usersService.deleteUser(userId);

      return sendSuccess(res, 200, 'User deleted successfully');
    } catch (error: any) {
      return sendError(res, 400, error.message);
    }
  };
}
