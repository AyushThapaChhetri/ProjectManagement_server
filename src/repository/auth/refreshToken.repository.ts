import prisma from "@app/config/db.config";
import BaseRepository from "../contract/baseRepository";

class RefreshTokenRepository extends BaseRepository {
  static async create(userId: number, token: string, expiresAt: Date) {
    return await prisma.refreshToken.create({
      data: {
        userId,
        token,
        expiresAt,
      },
    });
  }

  static async findByToken(token: string) {
    return prisma.refreshToken.findUnique({
      where: { token },
    });
  }

  static async deleteByToken(token: string) {
    return prisma.refreshToken.delete({
      where: { token },
    });
  }
}

export default RefreshTokenRepository;
