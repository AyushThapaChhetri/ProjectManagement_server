// import {
//   Body,
//   Controller,
//   Example,
//   Get,
//   Middlewares,
//   Path,
//   Post,
//   Query,
//   Response,
//   Route,
//   SuccessResponse,
//   Tags,
// } from "tsoa";
// // import { NextFunction, Request, Response } from "express";
// import BaseController from "./contract/baseController.contract";
// import { AuthService } from "src/service/auth/auth.service";
// import { UserDTO } from "src/dto/user/user.dto";
// import {
//   BadRequestError,
//   UnauthorizedError,
//   UserNotFoundError,
// } from "@app/service/contract/errors/errors";
// import { SignupResponse, UserResponseData } from "../dto/user/UserResponse.dto";
// import { SignupRequest } from "../dto/user/SignupRequest.dto";
// import { ErrorResponse } from "../dto/Error/ErrorResponse.dto";
// import {
//   loginValidationSchema,
//   refreshTokenValidationSchema,
//   signupValidationSchema,
// } from "./validation/auth.validation";
// import { validate_schemas } from "../middlewares/validationMiddleware";
// import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
// import { BadRequestErrorResponse } from "../dto/Error/BadRequestErrorResponse.dto";
// import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
// import { UserNotFoundErrorResponse } from "../dto/Error/UserNotFoundErrorResponse.dto";
// import { InternalErrorResponse } from "../dto/Error/InternalErrorResponse.dto";
// import { LoginResponse } from "../dto/user/LoginResponse.dto";
// import { LoginRequest } from "../dto/user/LoginRequest.dto";
// import {
//   RefreshTokenRequest,
//   RefreshTokenResponse,
// } from "../dto/refreshToken/RefreshToken.dto";
// import { LogoutResponse } from "../dto/user/LogoutResponse.dto";

// @Route("api/auth")
// @Tags("Auth")
// export class _AuthController extends BaseController {
//   @SuccessResponse("200", "SignUp successful")
//   @Response<ErrorResponse>(409, "Conflict - email already registered")
//   @Response<ValidationErrorResponse>(
//     422,
//     "Unprocessable Entity – validation errors",
//     {
//       message: "Validation failed",
//       errors: [{ field: "emailName", message: "Please Enter Email" }],
//     }
//   )
//   @Response<InternalErrorResponse>(500, "Internal server error")
//   @Post("signup")
//   @Middlewares(validate_schemas(signupValidationSchema))
//   public async signup(
//     @Body() signupData: SignupRequest
//   ): Promise<SignupResponse> {
//     const {
//       // fullName,
//       firstName,
//       lastName,
//       emailName: email, // Renaming emailName to email
//       emailPassword: password, // Renaming emailPassword to password
//       emailConfirmPassword: confirmPassword, // Renaming emailConfirmPassword to confirmPassword
//       gender,
//       emailDob: dob, // Renaming emailDob to dob
//       address,
//       phone,
//       title,
//       avatarUrl,
//     } = signupData;

//     const user = await AuthService.register({
//       firstName,
//       lastName,
//       email,
//       password,
//       gender,
//       dob: new Date(dob), // Ensure dob is converted to Date format
//       address,
//       phone,
//       title,
//       avatarUrl,
//     });

//     // Send success response
//     return super.postOk({
//       message: "User created successfully",
//       data: UserDTO.single(user),
//     });
//   }

//   @SuccessResponse("200", "Login successful")
//   @Response<BadRequestErrorResponse>(400, "Invalid input")
//   @Response<UnauthorizedErrorResponse>(401, "Unauthorized – wrong credentials")
//   @Response<UserNotFoundErrorResponse>(404, "User not found")
//   @Response<ValidationErrorResponse>(422, "Validation error", {
//     message: "Validation failed",
//     errors: [{ field: "emailName", message: "Please Enter Email" }],
//   })
//   @Response<InternalErrorResponse>(500, "Internal server error")
//   @Middlewares(validate_schemas(loginValidationSchema))
//   // async login(req: Request, res: Response) {
//   @Post("login")
//   public async login(@Body() loginData: LoginRequest): Promise<LoginResponse> {
//     const { emailName: email, emailPassword: password } = loginData;
//     // const {
//     //   emailName: email, // Rename emailName to email to match schema
//     //   emailPassword: password,
//     // } = req.body;

//     // try {
//     const { user, accessToken, refreshToken } = await AuthService.login({
//       email,
//       password,
//     });

//     return super.postOk({
//       message: "Login successful",
//       data: {
//         user: UserDTO.single(user), // Convert user data using UserDTO
//         accessToken, // Include the generated token
//         refreshToken,
//       },
//     });
//     // } catch (error) {
//     //   // Handle error if login fails (e.g., incorrect credentials)
//     //   if (error instanceof BadRequestError) {
//     //     // If error is a BadRequestError, send appropriate response
//     //     return {
//     //       statusCode: 400,
//     //       data: { message: error.message },
//     //     };
//     //   }
//     //   if (error instanceof UnauthorizedError) {
//     //     // If error is a BadRequestError, send appropriate response
//     //     return {
//     //       statusCode: 401,
//     //       data: { message: error.message },
//     //     };
//     //   }
//     //   if (error instanceof UserNotFoundError) {
//     //     // If error is a BadRequestError, send appropriate response
//     //     return {
//     //       statusCode: 404,
//     //       data: { message: error.message },
//     //     };
//     //   }

//     //   // Handle other errors (if any)
//     //   return {
//     //     statusCode: 500,
//     //     data: { message: "Something went wrong!" },
//     //   };
//     // }

//     // return super.postOk({
//     //   message: "Login data received successfully",
//     //   data: loginCredentials,
//     // });
//   }

//   // async refresh(req: Request, res: Response) {
//   // const { refreshToken } = req.body;
//   @SuccessResponse("200", "Token Refreshed Successfully")
//   @Response<UnauthorizedErrorResponse>(401, "Unauthorized", {
//     error: "Refresh token expired",
//   })
//   @Response<UserNotFoundErrorResponse>(404, "Not Found", {
//     error: "User not found",
//   })
//   @Response<ValidationErrorResponse>(422, "Validation Failed", {
//     message: "Validation failed",
//     errors: [{ field: "refreshToken", message: "Refresh token is required" }],
//   })
//   @Response<InternalErrorResponse>(500, "Internal server error")
//   @Middlewares(validate_schemas(refreshTokenValidationSchema))
//   @Post("refresh")
//   public async refresh(
//     @Body() refreshData: RefreshTokenRequest
//   ): Promise<RefreshTokenResponse> {
//     const { refreshToken } = refreshData;
//     console.log("Refresh Token from controller: ");
//     console.log("Refresh Token from controller: ", refreshToken);

//     if (!refreshToken) {
//       throw new BadRequestError("Refresh token is required");
//     }

//     const { accessToken, refreshToken: newRefreshToken } =
//       await AuthService.refreshToken(refreshToken);

//     return super.postOk({
//       message: "Token Refreshed Successfully",
//       data: {
//         accessToken, // Include the generated token
//         refreshToken: newRefreshToken,
//       },
//     });
//   }

//   // async logout(req: Request, res: Response) {
//   //   // console.log("Delete controller");
//   //   const { refreshToken } = req.body;
//   // console.log("Refresh Token", refreshToken);
//   @SuccessResponse("200", "LoggedOut Successfully")
//   @Response<ValidationErrorResponse>(422, "Validation error", {
//     message: "Validation failed",
//     errors: [{ field: "refreshToken", message: "Refresh Token is Required" }],
//   })
//   @Response<UnauthorizedErrorResponse>(401, "Unauthorized", {
//     error: "Refresh token Invalid",
//   })
//   @Response<InternalErrorResponse>(500, "Internal server error")
//   @Middlewares(validate_schemas(refreshTokenValidationSchema))
//   @Post("logout")
//   public async logout(
//     @Body() logoutData: RefreshTokenRequest
//   ): Promise<LogoutResponse> {
//     const { refreshToken } = logoutData;
//     if (!refreshToken) {
//       // return res.status(400).json({ error: "Refresh token is required" });
//       throw new BadRequestError("Refresh token is required");
//     }

//     // Delete the refresh token from the database
//     await AuthService.logout(refreshToken);
//     // await RefreshTokenRepository.deleteByToken(refreshToken);

//     // return res.status(200).json({ message: "Logged out successfully" });
//     return super.postOk({
//       message: "Logged out successfully",
//       data: {},
//     });
//   }

//   // /me -> return the logged in user
//   // async me(req: Request, res: Response, next: NextFunction) {
//   //   // console.log(req.user!);
//   //   if (!req.user) {
//   //     throw new BadRequestError("User not found or not authenticated");
//   //   }

//   //   return super.getOk({
//   //     message: "Profile Details Fetched successfully",
//   //     data: UserDTO.single(req.user),
//   //   });
//   // }
//   // @Security('jwt')
//   // @Get('me')
//   // public async me(@Header('Authorization') authHeader: string): Promise<any> {
//   //   const token = authHeader?.split(' ')[1];
//   //   if (!token) throw new UnauthorizedError('Unauthorized');
//   //   const user = await AuthService.validateToken(token);
//   //   if (!user) throw new BadRequestError('User not found or not authenticated');
//   //   return this.getOk({ message: 'Profile Details Fetched successfully', data: UserDTO.single(user) });
//   // }
// }

// export const AuthController = new _AuthController();
