import { Request, Response } from 'express';
import { ProductService } from '../services/product.service';
import { successResponse, errorResponse } from '../utils/response';
import { createProductSchema, updateProductSchema, stockUpdateSchema } from '../validators/product.validator';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const { search, category, page = '1', limit = '10' } = req.query;
    const data = await ProductService.getProducts({
      search: search as string,
      category: category as string,
      page: parseInt(page as string),
      limit: parseInt(limit as string)
    });
    return successResponse(res, data);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = createProductSchema.parse(req.body);
    const product = await ProductService.createProduct(validatedData, req.user!.userId);
    return successResponse(res, product, 201);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await ProductService.getProductById(req.params.id);
    return successResponse(res, product);
  } catch (error: any) {
    return errorResponse(res, error.message, 404);
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    const validatedData = updateProductSchema.parse(req.body);
    const product = await ProductService.updateProduct(req.params.id, validatedData);
    return successResponse(res, product);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};

export const getProductMovements = async (req: Request, res: Response) => {
  try {
    const movements = await ProductService.getProductMovements(req.params.id);
    return successResponse(res, movements);
  } catch (error: any) {
    return errorResponse(res, error.message, 500);
  }
};

export const updateStock = async (req: Request, res: Response) => {
  try {
    const validatedData = stockUpdateSchema.parse(req.body);
    const product = await ProductService.updateStock(req.params.id, req.user!.userId, validatedData);
    return successResponse(res, product);
  } catch (error: any) {
    return errorResponse(res, error.errors || error.message, 400);
  }
};
