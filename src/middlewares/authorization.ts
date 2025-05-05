import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../service/contract/errors/errors";
import UserRepository from "../repository/user/user.repository";

export const authorize = (requiredPrivilege?: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const targetUserId = parseInt(req.params.id);

      // If no user on the request, block immediately
      if (!userId) {
        return next(new ForbiddenError("Not authenticated"));
      }

      // Allow self‑operation
      if (userId === targetUserId) {
        return next();
      }

      // Privilege check
      if (requiredPrivilege) {
        const privileges = await UserRepository.getUserPrivileges(userId);
        if (!privileges.includes(requiredPrivilege)) {
          return next(new ForbiddenError("Insufficient permissions"));
        }
      }

      return next();
    } catch (err) {
      return next(err);
    }
  };
};
