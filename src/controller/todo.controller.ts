// import {
//   Body,
//   Controller,
//   Delete,
//   Example,
//   Get,
//   Header,
//   Middlewares,
//   Patch,
//   Path,
//   Post,
//   Put,
//   Query,
//   Request,
//   // Request,
//   Response,
//   Route,
//   Security,
//   SuccessResponse,
//   Tags,
// } from "tsoa";
// import { TodoService } from "@app/service/todo/todo.service";
// import { Request as ExRequest, Response as ExResponse } from "express";
// import BaseController from "./contract/baseController.contract";
// import { TodosResponse } from "../dto/todo/TodoResponse.dto";
// import { DeleteTodoResponse } from "../dto/todo/DeleteTodoResponse.dto";
// import { BadRequestErrorResponse } from "../dto/Error/BadRequestErrorResponse.dto";
// import { UpdateTodoRequest } from "../dto/todo/UpdateTodoRequest.dto";
// import { UpdateTodoResponse } from "../dto/todo/UpdateTodoResponse.dto";
// import { validate_schemas } from "../middlewares/validationMiddleware";
// import {
//   patchTodoValidationSchema,
//   todoValidationSchema,
// } from "./validation/todo.validation";
// import { ValidationErrorResponse } from "../dto/Error/ValidationErrorResponse.dto";
// import { CreateTodoRequest } from "../dto/todo/CreateTodoRequest.dto";
// import { CreateTodoResponse } from "../dto/todo/CreateTodoResponse.dto";

// @Route("api/client/todos")
// @Tags("Todos")
// export class _TodoController extends BaseController {
//   // Helper function to extract the date part (YYYY-MM-DD)
//   // Class method to format dates
//   // private formatDate(date?: string) {
//   //   if (!date) return undefined;
//   //   const parsedDate = new Date(date);
//   //   // Fix condition to check for invalid dates
//   //   if (isNaN(parsedDate.getTime())) return undefined;
//   //   // Return full ISO string instead of splitting
//   //   return parsedDate.toISOString();
//   // }
//   // Modified to return full ISO string instead of YYYY-MM-DD to match frontend input
//   private formatDate(date: string | null): string {
//     if (date && !isNaN(new Date(date).getTime())) {
//       return date; // Return the original ISO string (e.g., "2025-04-22T12:00:20.160Z")
//     } else {
//       console.error(`Invalid date: ${date}`);
//       return ""; // Return empty string for invalid or null dates
//     }
//   }

// async create(req: ExRequest, res: Response) {
//   @Security("jwt")
//   @SuccessResponse("200", "Todo Insert Successful")
//   @Response<ValidationErrorResponse>(422, "Validation failed")
//   @Response<BadRequestErrorResponse>(400, "BadRequestError")
//   @Middlewares(validate_schemas(todoValidationSchema))
//   @Post("")
//   public async create(
//     @Request() request: ExRequest,
//     @Body() body: CreateTodoRequest
//   ): Promise<CreateTodoResponse> {
//     const userId = request.user.id;
//     const todo = await TodoService.createTodo(userId, request.body);

//     const serializedTodo = {
//       ...todo,
//       id: todo.id.toString(), // Convert BigInt to string
//       createdAt: todo.createdAt.toISOString(),
//       startDate: this.formatDate(todo.startDate), // Use class method
//       endDate: this.formatDate(todo.endDate), // Use class method
//     };

//     return super.postOk({
//       message: "Todo Insert Successful",
//       data: serializedTodo,
//     });
//   }

//   @Security("jwt")
//   @Get("")
//   // async readAll(req: ExRequest, res: Response) {
//   async readAll(@Request() request: ExRequest): Promise<TodosResponse> {
//     const userId = request.user.id;
//     // const userId = req.user.id;
//     const todos = await TodoService.getTodosByUser(userId);
//     console.log("Todos before serialization:", todos);

//     const serializedTodos = todos.map((todo) => ({
//       ...todo,
//       id: todo.id.toString(),
//       createdAt: todo.createdAt.toString(),
//       startDate: this.formatDate(todo.startDate), // Use class method
//       endDate: this.formatDate(todo.endDate), // Use class method
//     }));

//     return super.getOk({
//       message: "Todo Retrieved Successful",
//       data: serializedTodos,
//     });
//   }

//   async getById(req: ExRequest, res: Response) {
//     const userId = (req.user as any).id;
//     const id = BigInt(req.params.id);
//     const todo = await TodoService.getTodoById(id, userId);
//     return this.getOk({ message: "Todo retrieved successfully", data: todo });
//   }

//   // async update(req: ExRequest, res: Response) {
//   @Security("jwt")
//   @SuccessResponse("200", "Todo updated successfully")
//   @Response<ValidationErrorResponse>(422, "Validation failed")
//   @Response<BadRequestErrorResponse>(400, "BadRequestError")
//   @Middlewares(validate_schemas(patchTodoValidationSchema))
//   @Put("{id}")
//   async update(
//     @Request() request: ExRequest,
//     @Path() id: string,
//     @Body() body: UpdateTodoRequest
//   ): Promise<UpdateTodoResponse> {
//     // const userId = (request.user as any).id;
//     // const id = BigInt(request.params.id);

//     const userId = request.user.id;
//     const todoId = BigInt(id);

//     const todo = await TodoService.updateTodosByUser(
//       todoId,
//       userId,
//       request.body
//     );

//     const serializedTodos = {
//       ...todo,
//       id: todo.id.toString(),
//       createdAt: todo.createdAt.toISOString(),
//       startDate: this.formatDate(todo.startDate), // Use class method
//       endDate: this.formatDate(todo.endDate), // Use class method
//     };
//     return super.getOk({
//       message: "Todo Update Successful",
//       data: serializedTodos,
//     });
//   }

//   @Security("jwt")
//   @SuccessResponse("200", "Todo partially updated successfully")
//   @Response<ValidationErrorResponse>(422, "Validation failed")
//   @Response<BadRequestErrorResponse>(400, "BadRequestError")
//   @Middlewares(validate_schemas(patchTodoValidationSchema))
//   @Patch("{id}") // <-- PATCH instead of PUT
//   public async patchUpdate(
//     @Request() request: ExRequest,
//     @Path() id: string,
//     @Body() body: UpdateTodoRequest
//   ): Promise<UpdateTodoResponse> {
//     const userId = request.user.id;
//     const todoId = BigInt(id);

//     const todo = await TodoService.updateTodosByUser(
//       todoId,
//       userId,
//       request.body
//     );

//     // Helper function to extract the date part (YYYY-MM-DD)
//     // const formatDate = (date: string | null) => {
//     //   return date ? new Date(date).toISOString().split("T")[0] : ""; // Default to empty string for null
//     // };

//     const serializedTodos = {
//       ...todo,
//       id: todo.id.toString(),
//       createdAt: todo.createdAt.toISOString(),
//       startDate: this.formatDate(todo.startDate), // Use class method
//       endDate: this.formatDate(todo.endDate), // Use class method
//     };
//     return super.getOk({
//       message: "Todo Patch Update Successful",
//       data: serializedTodos,
//     });
//   }

//   @SuccessResponse(200, "Todo Deleted Successfully")
//   @Response<BadRequestErrorResponse>(400, "BadRequest")
//   @Security("jwt")
//   @Delete("{id}")
//   // async delete(@Request() request: ExRequest, @Path() id: string) {
//   async delete(
//     @Request() request: ExRequest,
//     @Path() id: string
//   ): Promise<DeleteTodoResponse> {
//     const userId = (request.user as any).id;
//     console.log(userId, " : user id");
//     const Bid = BigInt(request.params.id);
//     const result = await TodoService.deleteTodo(Bid, userId);
//     return super.getOk({ message: result.message, data: {} });
//   }
// }

// export const TodoController = new _TodoController();
