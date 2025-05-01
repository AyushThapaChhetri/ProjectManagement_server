// // import prisma from "@app/config/db.config";
// import prisma from "../../config/db.config";

// class TodoRepository {
//   async create(data: {
//     projectName: string;
//     taskName: string;
//     priority: string;
//     progressStatus: string;
//     startDate?: string;
//     endDate?: string;
//     hoursTime?: string;
//     minutesTime?: string;
//     secondsTime?: string;
//     userId: number;
//   }) {
//     const {
//       projectName,
//       taskName,
//       priority,
//       progressStatus,
//       startDate,
//       endDate,
//       hoursTime,
//       minutesTime,
//       secondsTime,
//       userId,
//     } = data;

//     return await prisma.todo.create({
//       data: {
//         createdAt: new Date(),
//         projectName,
//         taskName,
//         priority,
//         progressStatus,
//         startDate,
//         endDate,
//         hoursTime,
//         minutesTime,
//         secondsTime,
//         userId,
//       },
//     });
//   }

//   // get all users
//   async findAllByUser(userId: number) {
//     return await prisma.todo.findMany({
//       where: {
//         userId: userId,
//       },
//     });
//   }

//   async findById(id: bigint, userId: number) {
//     return prisma.todo.findUnique({ where: { id, userId } });
//   }

//   async update(
//     id: bigint,
//     userId: number,
//     data: Partial<{
//       projectName: string;
//       taskName: string;
//       priority: string;
//       progressStatus: string;
//       startDate?: string;
//       endDate?: string;
//       hoursTime?: string;
//       minutesTime?: string;
//       secondsTime?: string;
//     }>
//   ) {
//     return prisma.todo.update({ where: { id, userId }, data });
//   }

//   async delete(id: bigint, userId: number) {
//     return prisma.todo.delete({
//       where: { id, userId },
//     });
//   }
// }

// export default new TodoRepository();
