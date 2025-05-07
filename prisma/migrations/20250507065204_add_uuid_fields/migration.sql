/*
  Warnings:

  - A unique constraint covering the columns `[uid]` on the table `Privilege` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rid]` on the table `RefreshToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `Task` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[uid]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Privilege" ADD COLUMN     "uid" TEXT;

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "uid" TEXT;

-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "uid" TEXT;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "uid" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Privilege_uid_key" ON "Privilege"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Project_uid_key" ON "Project"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "RefreshToken_rid_key" ON "RefreshToken"("rid");

-- CreateIndex
CREATE UNIQUE INDEX "Role_uid_key" ON "Role"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Task_uid_key" ON "Task"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "User_uid_key" ON "User"("uid");
