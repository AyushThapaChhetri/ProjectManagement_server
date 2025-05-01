import express from "express";
import { User } from "@prisma/client"; // or your user type/interface

declare global {
  namespace Express {
    interface Request {
      user: User;
    }
  }
}
