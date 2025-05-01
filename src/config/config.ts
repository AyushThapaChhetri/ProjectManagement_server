// Load environment variables from .env

import dotenv from "dotenv";
dotenv.config();

export const ENVIRONMENT = process.env.NODE_ENV || "DEV";
export const PORT = process.env.PORT || 5000;
export const JWT_SECRET = process.env.JWT_SECRET!;
export const JWT_EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN || "900");
// export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
export const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:5173",
];
// export const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173/";
