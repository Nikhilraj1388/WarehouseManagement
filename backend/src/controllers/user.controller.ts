import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { successResponse, errorResponse } from '../utils/response';
import { createUserSchema, updateUserSchema } from '../validators/user.validator';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const { search, role, page = '1', limit = '10' } = req.query;
    const data = await UserService.getUsers({
      search: search as string,
      role: role as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const user = await UserService.createUser(validatedData);
    return successResponse(res, user, 201);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const validatedData = updateUserSchema.parse(req.body);
    const user = await UserService.updateUser(req.params.id, validatedData);
    return successResponse(res, user);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    await UserService.deleteUser(req.params.id, req.user!.userId);
    return successResponse(res, { message: 'User deleted successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};
