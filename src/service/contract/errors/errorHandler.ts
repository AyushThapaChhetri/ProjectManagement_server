import { NextFunction, Request, Response } from "express";
import {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
} from "./errors";
import { DBError } from "./dbErrorHandler";

class _HttpErrorHandler {
  private log(error: Object) {
    console.error(error);
    console.error(JSON.stringify(error, undefined, "  "));
  }

  catch(
    httpFunction: (
      req: Request,
      res: Response,
      next: NextFunction
    ) => Promise<{ statusCode: number; data: Object }>
  ) {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { data, statusCode } = await httpFunction(req, res, next);
        res.status(statusCode).json(data);
      } catch (error: any) {
        this.log(error.log || error);
        if (error instanceof BadRequestError) {
          res.status(error.statusCode).json({
            message: error.message,
          });
        } else if (error instanceof DBError) {
          res.status(error.statusCode).json({
            message: error.message,
          });
        } else if (error instanceof NotFoundError) {
          res.status(error.statusCode).json({
            message: error.message,
          });
        } else if (error instanceof UnauthorizedError) {
          res.status(error.statusCode).json({
            message: error.message,
          });
        } else if (error instanceof ForbiddenError) {
          res.status(error.statusCode).json({
            message: error.message,
          });
        } else {
          const statusCode = error.statusCode || 500;
          res.status(statusCode).json({
            message: error?.message ?? "Something went wrong",
          });
        }
      }
    };
  }

  // New static method for global error handling with tsoa
  public static errorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    // Log the error (similar to the original log method)
    console.error(err);
    console.error(JSON.stringify(err, undefined, "  "));

    // Handle specific error types
    if (err instanceof BadRequestError) {
      res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof UnauthorizedError) {
      res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof ForbiddenError) {
      res.status(err.statusCode).json({ message: err.message });
    } else if (err instanceof DBError) {
      res.status(err.statusCode).json({ message: err.message });
    } else {
      // Fallback for unhandled errors
      const statusCode = err.statusCode || 500;
      res
        .status(statusCode)
        .json({ message: err.message || "Something went wrong" });
    }
  }
}
export const HttpErrorHandler = new _HttpErrorHandler();

export const errorHandler = _HttpErrorHandler.errorHandler;
