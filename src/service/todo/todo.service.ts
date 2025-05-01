// import TodoRepository from "../../repository/todo/todo.repository";
// import { BadRequestError } from "../contract/errors/errors";

// class _TodoService {
//   async createTodo(
//     userId: number,
//     params: {
//       projectName: string;
//       taskName: string;
//       priority: string;
//       progressStatus: string;
//       startDate?: string;
//       endDate?: string;
//       hoursTime?: string;
//       minutesTime?: string;
//       secondsTime?: string;
//     }
//   ) {
//     if (!params.projectName || !params.taskName) {
//       throw new BadRequestError("Project name and task name are required");
//     }

//     const newTodo = await TodoRepository.create({
//       ...params,
//       userId,
//       startDate: params.startDate || "",
//       endDate: params.endDate || "",
//       hoursTime: params.hoursTime || "0",
//       minutesTime: params.minutesTime || "0",
//       secondsTime: params.secondsTime || "0",
//     });

//     return newTodo;
//   }
//   async getTodosByUser(userId: number) {
//     const todos = await TodoRepository.findAllByUser(userId);
//     console.log("Todos from service: ", todos);
//     return todos;
//   }

//   async getTodoById(id: bigint, userId: number) {
//     const todo = await TodoRepository.findById(id, userId);
//     if (!todo) throw new BadRequestError("Todo not found");
//     return todo;
//   }

//   // async updateTodosByUser(params: {
//   //   id: string | number;
//   //   projectName?: string;
//   //   taskName?: string;
//   //   priority?: string;
//   //   progressStatus?: string;
//   //   startDate?: string;
//   //   endDate?: string;
//   //   hoursTime?: string;
//   //   minutesTime?: string;
//   //   secondsTime?: string;
//   //   userId: number;
//   // }) {

//   async updateTodosByUser(
//     id: bigint,
//     userId: number,
//     data: Partial<{
//       projectName: string;
//       taskName: string;
//       priority: string;
//       progressStatus: string;
//       startDate: string;
//       endDate: string;
//       hoursTime: string;
//       minutesTime: string;
//       secondsTime: string;
//     }>
//   ) {
//     const todo = await TodoRepository.findById(id, userId);
//     if (!todo) throw new BadRequestError("Todo not found");

//     const updateTodo = await TodoRepository.update(id, userId, data);
//     console.log("Updated from service", updateTodo);
//     return updateTodo;
//   }

//   async deleteTodo(id: bigint, userId: number) {
//     const todo = await TodoRepository.findById(id, userId);
//     if (!todo) throw new BadRequestError("Todo not found");
//     await TodoRepository.delete(id, userId);
//     return { message: "Todo deleted successfully" };
//   }
// }

// export const TodoService = new _TodoService();
