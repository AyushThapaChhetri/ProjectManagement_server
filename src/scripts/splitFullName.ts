// import { PrismaClient } from "@prisma/client";
// const prisma = new PrismaClient();

// async function main() {
//   const users = await prisma.user.findMany({
//     where: {
//       fullName: { not: null },
//       firstName: null,
//       lastName: null,
//     },
//   });

//   for (const user of users) {
//     const [first, ...rest] = user.fullName!.trim().split(" ");
//     await prisma.user.update({
//       where: { id: user.id },
//       data: {
//         firstName: first || "",
//         lastName: rest.join(" ") || "",
//       },
//     });
//   }

//   console.log("Migrated fullName to firstName + lastName");
// }

// main()
//   .catch(console.error)
//   .finally(() => prisma.$disconnect());
