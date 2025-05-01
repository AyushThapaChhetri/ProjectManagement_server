// import prisma from "@app/config/db.config";
// import BaseRepository from "../contract/baseRepository";

// class _UserRepository extends BaseRepository {
//   async create(params: {
//     firstName: string;
//     lastName: string;
//     email: string;
//     password: string;
//     gender: string;
//     dob: Date; // Keep dob as a string, then convert it to Date later
//     address?: string;
//     phone?: string;
//     title?: string;
//     avatarUrl?: string;
//   }) {
//     const {
//       firstName,
//       lastName,
//       email,
//       password,
//       gender,
//       dob,
//       address,
//       phone,
//       title,
//       avatarUrl,
//     } = params;

//     // Create the user in the database using Prisma
//     return super.dbCatch(
//       prisma.user.create({
//         data: {
//           createdAt: new Date(),
//           firstName,
//           lastName,
//           email,
//           password, // Store the hashed password (you should hash the password before saving)
//           gender,
//           // dob: new Date(dob), // Convert dob string to Date object
//           dob, // Convert dob string to Date object
//           address,
//           phone,
//           title,
//           avatarUrl,
//         },
//       })
//     );
//   }
// }
// export const UserRepository = new _UserRepository();
