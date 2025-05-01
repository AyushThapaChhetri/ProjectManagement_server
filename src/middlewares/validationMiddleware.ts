import * as Yup from "yup";
import { Request, Response, NextFunction } from "express";

export const validate_schemas = (schema: Yup.ObjectSchema<any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.validate(req.body, { abortEarly: false });
      next(); // Move to the next step if validation passes
    } catch (error) {
      const formattedErrors = Array.from(
        new Map(
          (error as Yup.ValidationError).inner.map((err) => [
            err.path,
            { field: err.path, message: err.message },
          ])
        ).values()
      );

      res.status(422).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
  };
};
