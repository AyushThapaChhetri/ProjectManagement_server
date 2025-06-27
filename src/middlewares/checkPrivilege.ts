import prisma from "@app/config/db.config";
import { Request, Response as ExpressResponse, NextFunction } from "express";

export const checkPrivilege = (requiredPrivilege: string) => {
  return async (req: Request, res: ExpressResponse, next: NextFunction) => {
    const userId = req.user.id; // Assuming user is attached by @Security("jwt")
    const userRoles = await prisma.userRole.findMany({
      where: { userId },
      include: {
        role: {
          include: {
            rolePrivileges: {
              include: { privilege: true },
            },
          },
        },
      },
    });
    const hasPrivilege = userRoles.some((userRole) =>
      userRole.role.rolePrivileges.some(
        (rp) => rp.privilege.name === requiredPrivilege
      )
    );
    if (!hasPrivilege) {
      return (
        res
          .status(403)
          // .json({ error: `User lacks '${requiredPrivilege}' privilege` });
          .json({ error: `User lacks privilege` })
      );
    }
    next();
  };
};
