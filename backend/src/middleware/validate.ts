import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod";

type ValidatedRequest = {
  body?: AnyZodObject;
  query?: AnyZodObject;
  params?: AnyZodObject;
};

export const validateRequest = (schemas: ValidatedRequest) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (schemas.body) {
        req.body = schemas.body.parse(req.body);
      }

      if (schemas.query) {
        req.query = schemas.query.parse(req.query);
      }

      if (schemas.params) {
        req.params = schemas.params.parse(req.params);
      }

      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      }

      next(error);
    }
  };
};
