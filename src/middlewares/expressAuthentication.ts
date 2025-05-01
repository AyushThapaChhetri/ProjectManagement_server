import { Request } from "express";
import prisma from "@app/config/db.config";
import { JWT_SECRET } from "@app/config/config";
import * as jwt from "jsonwebtoken";
import { UnauthorizedError } from "@app/service/contract/errors/errors";

export async function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<any> {
  const authHeader = request.headers.authorization;

  console.log("AuthHeader middleware expressAuthentication: ", authHeader);

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthorizedError("Unauthorized: No token provided");
  }

  const token = authHeader.split(" ")[1];
  console.log("Token middleware expressAuthentication: ", token);

  try {
    const payload = jwt.verify(token, JWT_SECRET) as any;

    const user = await prisma.user.findFirst({
      where: { uid: payload.userId },
    });

    if (!user) {
      throw new UnauthorizedError("Unauthorized: Invalid token");
    }

    // Attach user to request (optional, for access inside controller if needed)
    request.user = user as any;

    return user; // Return user to TSOA
  } catch (err) {
    throw new UnauthorizedError("Unauthorized: Invalid token");
  }
}
