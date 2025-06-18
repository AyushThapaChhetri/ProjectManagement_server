// import { PrismaClient } from "@prisma/client";
// import { v4 as uuidv4 } from "uuid";

// const prisma = new PrismaClient();

// async function populateUuids() {
//   try {
//     // Update Role
//     const roles = await prisma.role.findMany({ where: { uid: null } });
//     for (const role of roles) {
//       await prisma.role.update({
//         where: { id: role.id },
//         data: { uid: uuidv4() },
//       });
//     }

//     // Update Privilege
//     const privileges = await prisma.privilege.findMany({
//       where: { uid: null },
//     });
//     for (const privilege of privileges) {
//       await prisma.privilege.update({
//         where: { id: privilege.id },
//         data: { uid: uuidv4() },
//       });
//     }

//     // Update Project
//     const projects = await prisma.project.findMany({ where: { uid: null } });
//     for (const project of projects) {
//       await prisma.project.update({
//         where: { id: project.id },
//         data: { uid: uuidv4() },
//       });
//     }

//     // Update Task
//     const tasks = await prisma.task.findMany({ where: { uid: null } });
//     for (const task of tasks) {
//       await prisma.task.update({
//         where: { id: task.id },
//         data: { uid: uuidv4() },
//       });
//     }

//     console.log("UUIDs populated successfully");
//   } catch (error) {
//     console.error("Error populating UUIDs:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// populateUuids();
