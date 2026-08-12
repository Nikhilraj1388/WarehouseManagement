import { Request, Response } from 'express';
import { CustomerService } from '../services/customer.service';
import { successResponse, errorResponse } from '../utils/response';
import { createCustomerSchema, updateCustomerSchema, followUpSchema } from '../validators/customer.validator';

export const getCustomers = async (req: Request, res: Response) => {
  try {
    const { search, status, customerType, page = '1', limit = '10' } = req.query;
    const data = await CustomerService.getCustomers({
      search: search as string,
      status: status as string,
      customerType: customerType as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const createCustomer = async (req: Request, res: Response) => {
  try {
    const validatedData = createCustomerSchema.parse(req.body);
    const customer = await CustomerService.createCustomer(validatedData);
    return successResponse(res, customer, 201);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const getCustomerById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const customer = await CustomerService.getCustomerById(id);
    return successResponse(res, customer);
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
};

export const updateCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = updateCustomerSchema.parse(req.body);
    const customer = await CustomerService.updateCustomer(id, validatedData);
    return successResponse(res, customer);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const deleteCustomer = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    await CustomerService.deleteCustomer(id);
    return successResponse(res, { message: 'Customer deleted successfully' });
  } catch (error: any) {
    return errorResponse(res, error.message, 400);
  }
};

export const addFollowUp = async (req: Request, res: Response) => {
  try {
    const id = req.params.id as string;
    const validatedData = followUpSchema.parse(req.body);
    const followUp = await CustomerService.addFollowUp(id, req.user!.userId, validatedData);
    return successResponse(res, followUp, 201);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};
