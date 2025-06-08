import * as Yup from "yup";
import { Request, Response, NextFunction } from "express";

export const validate_schemas = (
  schema: Yup.ObjectSchema<any>,
  source: "body" | "params" | "query" = "body" // default is body
) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validate and get the transformed data
      const validatedData = await schema.validate(req[source], {
        abortEarly: false,
        stripUnknown: true, // removes extra fields not defined in schema
        strict: false, // allows transforms to run (like "" → null)
      });
      // Assign the transformed data back to the request
      req[source] = validatedData; // <-- THIS IS THE CRITICAL CHANGE
      next(); // Move to the next step if validation passes
    } catch (error) {
      const yupError = error as Yup.ValidationError;

      const formattedErrors =
        yupError.inner && yupError.inner.length > 0
          ? Array.from(
              new Map(
                yupError.inner.map((err) => [
                  err.path,
                  { field: err.path, message: err.message },
                ])
              ).values()
            )
          : [
              {
                field: yupError.path || "unknown",
                message: yupError.message,
              },
            ];

      res.status(422).json({
        message: "Validation failed",
        errors: formattedErrors,
      });
    }
    // catch (error) {
    //   const formattedErrors = Array.from(
    //     new Map(
    //       (error as Yup.ValidationError).inner.map((err) => [
    //         err.path,
    //         { field: err.path, message: err.message },
    //       ])
    //     ).values()
    //   );

    //   res.status(422).json({
    //     message: "Validation failed",
    //     errors: formattedErrors,
    //   });
    // }
  };
};
