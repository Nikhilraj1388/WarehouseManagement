import { Request, Response } from 'express';
import { ChallanService } from '../services/challan.service';
import { successResponse, errorResponse } from '../utils/response';
import { createChallanSchema, updateChallanStatusSchema } from '../validators/challan.validator';

export const getChallans = async (req: Request, res: Response) => {
  try {
    const { search, status, page = '1', limit = '10' } = req.query;
    const data = await ChallanService.getChallans({
      search: search as string,
      status: status as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const createChallan = async (req: Request, res: Response) => {
  try {
    const validatedData = createChallanSchema.parse(req.body);
    const challan = await ChallanService.createChallan(validatedData, req.user!.userId);
    return successResponse(res, challan, 201);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const getChallanById = async (req: Request, res: Response) => {
  try {
    const challan = await ChallanService.getChallanById(req.params.id);
    return successResponse(res, challan);
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
};

export const updateChallanStatus = async (req: Request, res: Response) => {
  try {
    const validatedData = updateChallanStatusSchema.parse(req.body);
    let challan;
    
    if (validatedData.status === 'CONFIRMED') {
      challan = await ChallanService.confirmChallan(req.params.id, req.user!.userId);
    } else {
      challan = await ChallanService.updateStatus(req.params.id, validatedData.status);
    }
    
    return successResponse(res, challan);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};
