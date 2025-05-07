// src/types/UserWithRoles.ts
import { User, UserRole, Role } from "@prisma/client";

export type UserWithRoles = User & {
  userRoles: (UserRole & {
    role: Role;
  })[];
};
