import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";
import { BadRequestError } from "@app/service/contract/errors/errors";

class ProjectRepository extends BaseRepository {
  async create(params: {
    name: string;
    description: string | null;
    deadline: Date | null;
    managerId: number | null;
    createdById: number;
  }) {
    return super.dbCatch(prisma.project.create({ data: params }));
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
      name: string;
      description: string | null;
      deadline: Date | null;
      managerId: number | null;
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
  async patchProject(
    projectId: number,
    data: Partial<{
      name: string;
      description: string | null;
      deadline: Date | null;
      managerUid: string | null;
    }>
  ) {
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

  async deleteProject(projectUid: string) {
    await prisma.project.delete({
      where: { uid: projectUid },
    });
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

  // Add these methods to the existing repository

  async findById(projectId: number) {
    return super.dbCatch(
      prisma.project.findUnique({
        where: { id: projectId },
      })
    );
  }
  async findByUid(projectUid: string) {
    return super.dbCatch(
      prisma.project.findUnique({
        where: { uid: projectUid },
      })
    );
  }

  async findByName(name: string) {
    return super.dbCatch(
      prisma.project.findFirst({
        where: {
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      })
    );
  }
}

export default new ProjectRepository();
