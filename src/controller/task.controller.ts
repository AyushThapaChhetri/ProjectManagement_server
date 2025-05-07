import { Request as ExRequest } from "express";
import {
  Body,
  Delete,
  Get,
  Middlewares,
  OperationId,
  Patch,
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
import BaseController from "./contract/baseController.contract";
import TaskService from "../service/task/task.service";
import { TaskRequest } from "../dto/task/TaskRequest.dto";
import TaskDTO from "../dto/task/task.dto";
import { TaskResponseData } from "../dto/task/TaskResponse.dto";
import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
import { UnauthorizedErrorResponse } from "../dto/Error/UnauthorizedErrorResponse.dto";
import { ForbiddenErrorResponse } from "../dto/Error/ForbiddenErrorResponse.dto";
import { validate_schemas } from "../middlewares/validationMiddleware";
import {
  deleteTaskValidationSchema,
  getTaskValidationSchema,
  TaskValidationSchema,
  updateTaskValidationSchema,
} from "./validation/task.validation";
import { authorize } from "../middlewares/authorization";
import { NotFoundError } from "../service/contract/errors/errors";
import { NotFoundErrorResponse } from "../dto/Error/NotFoundErrorResponse.dto";
import { PatchTaskRequest } from "../dto/task/PatchTaskRequest.dto";

// Controller
@Security("jwt")
@Response<ValidationErrorResponse>(422, "Validation failed")
@Response<UnauthorizedErrorResponse>(401, "Unauthorized")
@Response<ForbiddenErrorResponse>(403, "Forbidden")
@Response<NotFoundErrorResponse>(404, "Not Found Error")
@Route("/api/tasks")
@Tags("Tasks")
export class TaskController extends BaseController {
  /**
   * Create New Task
   * @param req  Express Request including user info
   * @param body Task creation data including name, status, priority, etc.
   * @returns The created task response payload
   */
  @SuccessResponse("200", "Task Created Successfully")
  @Middlewares([
    validate_schemas(TaskValidationSchema, "body"),
    authorize("create_task"),
  ])
  @Post()
  async create(@Request() req: ExRequest, @Body() body: TaskRequest) {
    const taskData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };

    const task = await TaskService.create(taskData);

    return super.postOk({
      message: "Task Created Successfully",
      data: TaskDTO.single(task),
    });
  }

  @SuccessResponse("200", "Task Retrieved Successfully")
  @Get()
  @Middlewares(authorize("read_task"))
  async getAll(
    @Request() req: ExRequest,
    @Query() page: number = 1,
    @Query() limit: number = 10
  ) {
    const { tasks, total } = await TaskService.getAllPaginated(page, limit);

    return Object.assign(
      super.getOk({
        message: "Tasks fetched successfully",
        data: tasks,
      }),
      { total }
    );
  }

  @SuccessResponse("200", "Task Retrieved Successfully")
  @Middlewares([
    validate_schemas(getTaskValidationSchema, "params"),
    authorize("read_task"),
  ])
  @Get("{taskId}")
  public async getById(
    // @Request() req: ExRequest,
    @Path() taskId: number
  ) {
    const task = await TaskService.getById(taskId);

    if (!task) {
      throw new NotFoundError("Task not found");
    }

    return super.getOk({
      message: "Task Retrieved Successfully",
      data: this.serializeTask(task),
    });
  }

  @SuccessResponse("200", "Task Updated Successfully")
  @Middlewares([
    validate_schemas(updateTaskValidationSchema, "body"),
    validate_schemas(getTaskValidationSchema, "params"),
    authorize("update_task"),
  ])
  @Put("{taskId}")
  public async update(
    @Request() req: ExRequest,
    // req: Request,
    @Path() taskId: number,
    @Body() body: TaskRequest
  ) {
    const updateData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };

    const updatedTask = await TaskService.updateTask(taskId, updateData);

    return super.putOk({
      message: "Task Updated Successfully",
      data: this.serializeTask(updatedTask),
    });
  }

  private serializeTask(task: any) {
    return {
      ...task,
      deadline: task.deadline?.toISOString() ?? null,
      createdAt: task.createdAt.toISOString(),
      updatedAt: task.updatedAt.toISOString(),
    };
  }

  @SuccessResponse("200", "Task Updated Successfully")
  @Middlewares([
    validate_schemas(updateTaskValidationSchema, "body"),
    validate_schemas(getTaskValidationSchema, "params"),
    authorize("update_task_status"),
  ])
  @Patch("{taskId}")
  public async patch(
    @Request() req: ExRequest,
    // req: Request,
    @Path() taskId: number,
    @Body() body: PatchTaskRequest
  ) {
    const userId = req.user.id;

    const patchData = {
      ...body,
      startDate: body.startDate ? new Date(body.startDate) : undefined,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
    };

    const updatedTask = await TaskService.patch(userId, taskId, patchData);

    return super.putOk({
      message: "Task Updated Successfully",
      data: this.serializeTask(updatedTask),
    });
  }

  @SuccessResponse("200", "Task Deleted Successfully")
  // forbidden 403
  @Middlewares([
    validate_schemas(deleteTaskValidationSchema, "params"),
    authorize("delete_task"),
  ])
  @Delete("{taskId}")
  public async delete(@Request() request: ExRequest, @Path() taskId: number) {
    // const userId = request.user.id; // Verify user is authenticated
    await TaskService.deleteTask(taskId, request.user);
    return super.deleteOk({
      message: "Task Deleted Successfully",
      data: {},
    });
  }
}
