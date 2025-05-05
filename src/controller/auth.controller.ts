import {
  Body,
  Controller,
  Example,
  Get,
  Middlewares,
  Path,
  Post,
  Query,
  Response,
  Route,
  SuccessResponse,
  Tags,
} from "tsoa";
// // import { NextFunction, Request, Response } from "express";
import BaseController from "./contract/baseController.contract";
import { AuthService } from "src/service/auth/auth.service";
import { UserDTO } from "src/dto/user/user.dto";
import {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
} from "@app/service/contract/errors/errors";
// import { SignupResponse, UserResponseData } from "../dto/user/UserResponse.dto";
// import { SignupRequest } from "../dto/user/SignupRequest.dto";
// import { ErrorResponse } from "../dto/Error/ErrorResponse.dto";
import {
  loginValidationSchema,
  refreshTokenValidationSchema,
  signupValidationSchema,
} from "./validation/auth.validation";
import { validate_schemas } from "../middlewares/validationMiddleware";
import { BadRequestErrorResponse } from "../dto/Error/BadRequestErrorResponse.dto";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { NotFoundErrorResponse } from "../dto/Error/NotFoundErrorResponse.dto";
import { InternalErrorResponse } from "../dto/Error/InternalErrorResponse.dto";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { LoginResponse } from "../dto/auth/LoginResponse.dto";
import { LoginRequest } from "../dto/auth/LoginRequest.dto";
import {
  RefreshTokenRequest,
  RefreshTokenResponse,
} from "../dto/refreshToken/RefreshToken.dto";
import { LogoutResponse } from "../dto/auth/LogoutResponse.dto";

@Route("api/auth")
@Tags("Auth")
export class _AuthController extends BaseController {
  @SuccessResponse("200", "Login successful")
  @Response<BadRequestErrorResponse>(400, "Invalid input")
  @Response<UnauthorizedErrorResponse>(401, "Unauthorized – wrong credentials")
  @Response<NotFoundErrorResponse>(404, "User not found")
  @Response<ValidationErrorResponse>(422, "Validation error", {
    message: "Validation failed",
    errors: [{ field: "emailName", message: "Please Enter Email" }],
  })
  @Response<InternalErrorResponse>(500, "Internal server error")
  @Middlewares(validate_schemas(loginValidationSchema))
  // async login(req: Request, res: Response) {
  @Post("login")
  public async login(@Body() loginData: LoginRequest): Promise<LoginResponse> {
    const { emailName: email, emailPassword: password } = loginData;
    // const {
    //   emailName: email, // Rename emailName to email to match schema
    //   emailPassword: password,
    // } = req.body;

    // try {
    const { user, accessToken, refreshToken } = await AuthService.login({
      email,
      password,
    });

    return super.postOk({
      message: "Login successful",
      data: {
        user: UserDTO.single(user), // Convert user data using UserDTO
        accessToken, // Include the generated token
        refreshToken,
      },
    });
  }

  // async refresh(req: Request, res: Response) {
  // const { refreshToken } = req.body;
  @SuccessResponse("200", "Token Refreshed Successfully")
  @Response<UnauthorizedErrorResponse>(401, "Unauthorized", {
    error: "Refresh token expired",
  })
  @Response<NotFoundErrorResponse>(404, "Not Found", {
    error: "User not found",
  })
  @Response<ValidationErrorResponse>(422, "Validation Failed", {
    message: "Validation failed",
    errors: [{ field: "refreshToken", message: "Refresh token is required" }],
  })
  @Response<InternalErrorResponse>(500, "Internal server error")
  @Middlewares(validate_schemas(refreshTokenValidationSchema))
  @Post("refresh")
  public async refresh(
    @Body() refreshData: RefreshTokenRequest
  ): Promise<RefreshTokenResponse> {
    const { refreshToken } = refreshData;
    console.log("Refresh Token from controller: ");
    console.log("Refresh Token from controller: ", refreshToken);

    if (!refreshToken) {
      throw new BadRequestError("Refresh token is required");
    }

    const { accessToken, refreshToken: newRefreshToken } =
      await AuthService.refreshToken(refreshToken);

    return super.postOk({
      message: "Token Refreshed Successfully",
      data: {
        accessToken, // Include the generated token
        refreshToken: newRefreshToken,
      },
    });
  }

  @SuccessResponse("200", "LoggedOut Successfully")
  @Response<ValidationErrorResponse>(422, "Validation error", {
    message: "Validation failed",
    errors: [{ field: "refreshToken", message: "Refresh Token is Required" }],
  })
  @Response<UnauthorizedErrorResponse>(401, "Unauthorized", {
    error: "Refresh token Invalid",
  })
  @Response<InternalErrorResponse>(500, "Internal server error")
  @Middlewares(validate_schemas(refreshTokenValidationSchema))
  @Post("logout")
  public async logout(
    @Body() logoutData: RefreshTokenRequest
  ): Promise<LogoutResponse> {
    const { refreshToken } = logoutData;
    if (!refreshToken) {
      // return res.status(400).json({ error: "Refresh token is required" });
      throw new BadRequestError("Refresh token is required");
    }

    // Delete the refresh token from the database
    await AuthService.logout(refreshToken);
    // await RefreshTokenRepository.deleteByToken(refreshToken);

    // return res.status(200).json({ message: "Logged out successfully" });
    return super.postOk({
      message: "Logged out successfully",
      data: {},
    });
  }

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
}

export const AuthController = new _AuthController();
