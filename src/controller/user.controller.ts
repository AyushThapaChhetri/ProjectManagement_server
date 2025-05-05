import BaseController from "./contract/baseController.contract";
import { Request as ExRequest } from "express";
import { BadRequestError } from "@app/service/contract/errors/errors";
import { UserDTO } from "../dto/user/user.dto";
import {
  Body,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Query,
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
import { UserResponse, UserResponseData } from "../dto/user/UserResponse.dto";
import { ErrorResponse } from "../dto/Error/ErrorResponse.dto";
import { InternalErrorResponse } from "../dto/Error/InternalErrorResponse.dto";
import { authorize } from "../middlewares/authorization";
import { validate_schemas } from "@app/middlewares/validationMiddleware";
import { userUpdateSchema } from "./validation/user.validation";
import { UserUpdateRequest } from "../dto/user/UserUpdateRequest.dto";
import { DeleteUserResponse } from "../dto/user/UserDeleteResponse.dto";
import { UpdateUserParams } from "../dto/user/UpdateUserParams.dto";
import { UserListResponse } from "../dto/user/UserListResponse.dto";

// @Response<ValidationErrorResponse>(422, "Validation failed")
// @Response<BadRequestErrorResponse>(400, "BadRequestError")
@Route("api/user")
@Tags("User")
export class _UserController extends BaseController {
  @SuccessResponse("200", "SignUp successful")
  @Response<ErrorResponse>(409, "Conflict - email already registered")
  @Response<ValidationErrorResponse>(
    422,
    "Unprocessable Entity – validation errors",
    {
      message: "Validation failed",
      errors: [{ field: "emailName", message: "Please Enter Email" }],
    }
  )
  @Response<InternalErrorResponse>(500, "Internal server error")
  @Post("signup")
  // async getProfile(@Request() request: ExRequest) {
  async create(@Body() signUpData: SignupRequest): Promise<UserResponse> {
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

  // GET ALL USERS
  @Security("jwt")
  @SuccessResponse("200", "Users fetched successfully")
  @Get()
  @Middlewares([authorize("read_user")])
  async getAllUsers(
    @Query() page: number = 1,
    @Query() limit: number = 10,
    @Request() request: ExRequest
  ): Promise<UserListResponse> {
    const { users, total } = await UserService.getAllPaginated(page, limit);
    return Object.assign(
      super.getOk({
        message: "Users fetched successfully",
        data: UserDTO.list(users),
      }),
      { total }
    );
  }

  // GET SINGLE USER
  @SuccessResponse("200", "User fetched successfully")
  @Response<ErrorResponse>(404, "User not found")
  @Get("{id}")
  @Middlewares([authorize()]) // Allows self-access
  async getUserById(@Path() id: number): Promise<UserResponse> {
    const user = await UserService.getByIdWithRoles(id);

    return super.getOk({
      message: "User fetch successfully",
      data: UserDTO.single(user),
    });
  }

  // UPDATE USER
  @Put("{id}")
  @Middlewares([
    validate_schemas(userUpdateSchema),
    authorize("update_user"), // Combines self-access + privilege
  ])
  async updateUser(
    @Path() id: number,
    @Body() updateData: UserUpdateRequest
  ): Promise<UserResponse> {
    const params: UpdateUserParams = {
      ...updateData,
      dob: updateData.dob ? new Date(updateData.dob) : undefined,
    };

    const updatedUser = await UserService.update(id, params);

    const serialized = {
      ...updatedUser,
      dob: updatedUser.dob.toISOString(),
      createdAt: updatedUser.createdAt.toISOString(),
    };

    return super.putOk({
      message: "User updated successfully",
      data: UserDTO.single(updatedUser),
    });
  }

  // DELETE USER
  @SuccessResponse("200", "User deletion successful")
  @Response<ErrorResponse>(404, "User not found")
  @Delete("{id}")
  @Middlewares([
    authorize("delete_user"), // Combines self-access + privilege
  ])
  async deleteUser(@Path() id: number): Promise<DeleteUserResponse> {
    await UserService.delete(id);
    return super.deleteOk({
      message: "User deletion successfull",
      data: {},
    });
  }
}

// export const UserController = new _UserController();
