import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { successResponse, errorResponse } from '../utils/response';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return errorResponse(res, 'Email and password are required', 400);
    }

    const data = await AuthService.login(email, password);
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 401);
  }
};

export const getMe = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return errorResponse(res, 'Unauthorized', 401);
    }
    const user = await AuthService.getMe(req.user.userId);
    return successResponse(res, user);
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
};
