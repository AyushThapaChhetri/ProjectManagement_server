import {
  Body,
  Controller,
  Delete,
  Example,
  Get,
  Header,
  Middlewares,
  Patch,
  Path,
  Post,
  Put,
  Query,
  Request,
  // Request,
  Response,
  Route,
  Security,
  SuccessResponse,
  Tags,
} from "tsoa";
import { Request as ExRequest, Response as ExResponse } from "express";
import BaseController from "./contract/baseController.contract";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { validate_schemas } from "../middlewares/validationMiddleware";
import {
  createProjectValidationSchema,
  deleteProjectValidationSchema,
  getProjectValidationSchema,
  updateProjectValidationSchema,
} from "./validation/project.validation";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { ForbiddenErrorResponse } from "../dto/Error/ForbiddenErrorResponse.dto";
import { checkPrivilege } from "@app/middlewares/checkPrivilege";
import { DeleteProjectResponse } from "../dto/project/DeleteProjectResponse.dto";
import ProjectService from "@app/service/project/project.service";
import { ProjectRequest } from "../dto/project/ProjectRequest.dto";
import { ProjectResponse } from "../dto/project/ProjectResponse.dto";
import { NotFoundError } from "@app/service/contract/errors/errors";
import { NotFoundErrorResponse } from "../dto/Error/NotFoundErrorResponse.dto";

// Controller
@Security("jwt")
@Response<ValidationErrorResponse>(422, "Validation failed")
@Response<UnauthorizedErrorResponse>(401, "Unauthorized")
@Response<ForbiddenErrorResponse>(403, "Forbidden")
@Response<NotFoundErrorResponse>(404, "Not Found Error")
@Route("api/projects")
@Tags("Projects")
export class ProjectController extends BaseController {
  @SuccessResponse("200", "Project Created Successfully")
  @Middlewares([
    validate_schemas(createProjectValidationSchema, "body"),
    checkPrivilege("create_project"),
  ])
  @Post()
  async create(
    @Request() req: ExRequest,
    @Body() body: ProjectRequest
  ): Promise<ProjectResponse> {
    const managerId = req.user.id; // Assuming the JWT includes the user ID
    console.log("Req body: ", req.body);

    // Add the managerId to the project data
    const projectData = {
      ...body,
      managerId, // Automatically assign managerId from logged-in user
      deadline: body.deadline ? new Date(body.deadline) : undefined, // Convert string to Date
    };
    const project = await ProjectService.create(projectData);

    const serializedProject = {
      ...project,
      deadline: project.deadline?.toISOString() ?? null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };

    return super.postOk({
      message: "Project Created Successfully",
      data: serializedProject,
    });
  }

  @SuccessResponse("200", "Project Retrieved Successfully")
  @Get()
  @Middlewares(checkPrivilege("read_project"))
  async getAll(
    @Request() req: ExRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ) {
    const { projects, total } = await ProjectService.getAllPaginated(
      page,
      limit
    );

    return Object.assign(
      super.getOk({
        message: "Projects fetched successfully",
        data: projects,
      }),
      { total }
    );
  }

  @SuccessResponse("200", "Project Retrieved Successfully")
  @Middlewares([
    validate_schemas(getProjectValidationSchema, "params"),
    checkPrivilege("read_project"),
  ])
  @Get("{projectId}")
  public async getById(
    // @Request() req: ExRequest,
    @Path() projectId: number
  ): Promise<ProjectResponse> {
    const project = await ProjectService.getById(projectId);

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    return super.getOk({
      message: "Project Retrieved Successfully",
      data: this.serializeProject(project),
    });
  }

  @SuccessResponse("200", "Project Updated Successfully")
  @Middlewares([
    validate_schemas(updateProjectValidationSchema, "body"),
    validate_schemas(getProjectValidationSchema, "params"),
    checkPrivilege("update_project"),
  ])
  @Put("{projectId}")
  public async update(
    @Request() req: ExRequest,
    // req: Request,
    @Path() projectId: number,
    @Body() body: ProjectRequest
  ): Promise<ProjectResponse> {
    const updateData = {
      ...body,
      deadline: body.deadline ? new Date(body.deadline) : undefined,
    };

    const updatedProject = await ProjectService.updateProject(
      projectId,
      updateData
    );

    return super.putOk({
      message: "Project Updated Successfully",
      data: this.serializeProject(updatedProject),
    });
  }

  private serializeProject(project: any) {
    return {
      ...project,
      deadline: project.deadline?.toISOString() ?? null,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    };
  }

  @SuccessResponse("200", "Project Deleted Successfully")
  // forbidden 403
  @Middlewares([
    validate_schemas(deleteProjectValidationSchema, "params"),
    checkPrivilege("delete_project"),
  ])
  @Delete("{projectId}")
  public async delete(
    @Request() request: ExRequest,
    @Path() projectId: number
  ): Promise<DeleteProjectResponse> {
    // const userId = request.user.id; // Verify user is authenticated
    await ProjectService.deleteProject(projectId, request.user);
    return super.deleteOk({
      message: "Project Deleted Successfully",
      data: {},
    });
  }
}
