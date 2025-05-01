// import prisma from "@app/config/db.config";
// import {
//   BadRequestError,
//   UnauthorizedError,
//   UserAlreadyExistError,
//   UserNotFoundError,
// } from "../contract/errors/errors";
// import Hash from "src/libs/Hash";
// import { UserRepository } from "src/repository/auth/register.repository";
// import * as jwt from "jsonwebtoken";
// import crypto from "crypto";
// import { JWT_EXPIRES_IN, JWT_SECRET } from "@app/config/config";
// import RefreshTokenRepository from "@app/repository/auth/refreshToken.repository";

// class _AuthService {
//   // async register(params: {
//   //   email: string;
//   //   password: string;
//   //   fullName: string;
//   //   gender: string;
//   //   dob: Date;
//   // }) {
//   //   const { email, password, dob, fullName, gender } = params;

//   async register(params: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     gender: string;
//     dob: Date; // Keep dob as string, then convert to Date later
//     address?: string;
//     phone?: string;
//     title?: string;
//     avatarUrl?: string;
//   }) {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       gender,
//       dob,
//       address,
//       phone,
//       title,
//       avatarUrl,
//     } = params;
//     // First check if the email already exists
//     const existingUser = await prisma.user.findUnique({
//       where: { email },
//     });

//     if (existingUser) {
//       // Send error response and stop execution
//       throw new UserAlreadyExistError("Email already exists");
//     }

//     const hashedPassword = await Hash.createHash(password);

//     // return UserRepository.create({
//     //   email,
//     //   password: hashedPassword,
//     //   dob,
//     //   fullName,
//     //   gender,
//     // });
//     // Create the user in the database
//     return UserRepository.create({
//       firstName,
//       lastName,
//       email,
//       password: hashedPassword,
//       gender,
//       dob, // Convert dob to Date format
//       address,
//       phone,
//       title,
//       avatarUrl,
//     });
//   }

//   async login(params: { email: string; password: any }) {
//     const { email, password } = params;

//     let user = await prisma.user.findFirst({
//       where: { email },
//     });
//     if (!user) {
//       console.log("Email donesn't exists: ", email);
//       throw new UserNotFoundError("Email donesn't exists: ", email);
//       // throw
//     }
//     // console.log(password, user.password);
//     const comparePassword = await Hash.compareHash(password, user.password);

//     if (!comparePassword) {
//       // console.log("Incorrect password: ", user);
//       throw new UnauthorizedError("Incorrect Password");
//     } else {
//       // console.log("Login successful for:", email);
//       const accessToken = jwt.sign(
//         {
//           userId: user.uid,
//         },
//         JWT_SECRET,
//         { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" }
//       );

//       console.log("Access Token from Service :", accessToken);
//       //Generate refresh Token
//       const refreshToken = crypto.randomBytes(64).toString("hex");
//       const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//       console.log("Refresh Token from Service :", accessToken);

//       await RefreshTokenRepository.create(user.id, refreshToken, expiresAt);

//       return { user, accessToken, refreshToken };
//     }
//   }

//   async refreshToken(refreshToken: string) {
//     console.log(
//       "Received refresh token for refreshing request (service):",
//       refreshToken
//     );
//     const tokenRecord = await RefreshTokenRepository.findByToken(refreshToken);

//     if (!tokenRecord) {
//       console.log("Invalid Refresh Token", tokenRecord);
//       throw new UnauthorizedError("Invalid Refresh Token ");
//     }
//     console.log("Token found:", tokenRecord);

//     if (tokenRecord.expiresAt < new Date()) {
//       console.log("Refresh Token Expired");
//       await RefreshTokenRepository.deleteByToken(refreshToken);
//       throw new UnauthorizedError("Refresh token expired");
//     }

//     const user = await prisma.user.findUnique({
//       where: { id: tokenRecord.userId },
//     });

//     if (!user) {
//       throw new UserNotFoundError("User not found");
//     }

//     console.log("Generating new access token...");
//     // Generate new access token
//     const newAccessToken = jwt.sign({ userId: user.uid }, JWT_SECRET, {
//       expiresIn: JWT_EXPIRES_IN,
//       algorithm: "HS256",
//     });
//     console.log("new access token from service layer: ", newAccessToken);

//     console.log("Generating new refresh token...");
//     // Refresh token rotation: invalidate old token, issue new one
//     const newRefreshToken = crypto.randomBytes(64).toString("hex");
//     const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//     console.log("Deleting old refresh token...");
//     await RefreshTokenRepository.deleteByToken(refreshToken);
//     console.log("Old refresh token deleted");

//     console.log("Storing new refresh token...");
//     await RefreshTokenRepository.create(user.id, newRefreshToken, newExpiresAt);
//     console.log("Stored new refresh Token: ", newRefreshToken);

//     console.log("New tokens generated successfully");
//     return { accessToken: newAccessToken, refreshToken: newRefreshToken };
//   }

//   async logout(refreshToken: string) {
//     const tokenRecord = await RefreshTokenRepository.findByToken(refreshToken);

//     if (!tokenRecord) {
//       throw new UnauthorizedError("Refresh token Invalid");
//     }
//     await RefreshTokenRepository.deleteByToken(refreshToken);
//   }
// }
// export const AuthService = new _AuthService();
