import BaseController from "./contract/baseController.contract";
import { Request as ExRequest } from "express";
import { BadRequestError } from "@app/service/contract/errors/errors";
import { UserDTO } from "../dto/user/user.dto";
import {
  Body,
  Get,
  Post,
  Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { BadRequestErrorResponse } from "../dto/Error/BadRequestErrorResponse.dto";
import UserService from "../service/user/user.service";
import { SignupRequest } from "../dto/user/SignupRequest.dto";
import { SignupResponse, UserResponseData } from "../dto/user/UserResponse.dto";

// @Response<ValidationErrorResponse>(422, "Validation failed")
// @Response<BadRequestErrorResponse>(400, "BadRequestError")
@Route("api/user")
@Tags("User")
export class _UserController extends BaseController {
  // @Security("jwt")
  // @SuccessResponse("200", "User info fetched successfully")
  // @Get("me")
  @Post("signup")
  // async getProfile(@Request() request: ExRequest) {
  async create(@Body() signUpData: SignupRequest): Promise<SignupResponse> {
    // const id = request.id;
    const {
      // fullName,
      firstName,
      lastName,
      emailName: email, // Renaming emailName to email
      emailPassword: password, // Renaming emailPassword to password
      emailConfirmPassword: confirmPassword, // Renaming emailConfirmPassword to confirmPassword
      gender,
      emailDob: dob, // Renaming emailDob to dob
      address,
      phone,
      title,
      avatarUrl,
    } = signUpData;

    const user = await UserService.create({
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      gender,
      dob: new Date(dob), // Ensure dob is converted to Date format
      address,
      phone,
      title,
      avatarUrl,
    });

    // if (!userProfile) {
    //   throw new BadRequestError("User not found or not authenticated");
    // }

    // const { firstName, lastName, email, gender, dob } = userProfile;

    // Send success response
    return super.postOk({
      message: "User created successfully",
      data: UserDTO.single(user),
    });
  }
}

// export const UserController = new _UserController();
