import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";
import { BadRequestError } from "@app/service/contract/errors/errors";

class ProjectRepository extends BaseRepository {
  async create(data: {
    name: string;
    description?: string;
    deadline?: Date;
    managerId: number;
  }) {
    return super.dbCatch(prisma.project.create({ data }));
  }

  // Add these methods to the existing repository

  async findById(projectId: number) {
    return super.dbCatch(
      prisma.project.findUnique({
        where: { id: projectId },
      })
    );
  }

  async findAllPaginated(page: number, limit: number) {
    const [total, projects] = await Promise.all([
      prisma.project.count(),
      prisma.project.findMany({
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
    ]);
    return { projects, total };
  }

  async updateProject(
    projectId: number,
    data: {
      name?: string;
      description?: string;
      deadline?: Date;
    }
  ) {
    // prisma.$transaction(async (tx){
    //   await tx.role.create({data:{name:"BAC"}});
    //   const role = await prisma.role.findFirst({where:{name:"BAC"}})
    //   throw new BadRequestError("");
    // });

    return super.dbCatch(
      prisma.project.update({
        where: { id: projectId },
        data: {
          ...data,
          updatedAt: new Date(),
        },
      })
    );
  }

  async findAllByManager(managerId: number) {
    return super.dbCatch(
      prisma.project.findMany({
        where: {
          managerId,
        },
      })
    );
  }
  async deleteProject(projectId: number) {
    await prisma.project.delete({
      where: { id: projectId },
    });
  }
}

export default new ProjectRepository();
