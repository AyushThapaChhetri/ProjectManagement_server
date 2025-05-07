/*
  Warnings:

  - Made the column `uid` on table `Privilege` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uid` on table `Project` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uid` on table `Role` required. This step will fail if there are existing NULL values in that column.
  - Made the column `uid` on table `Task` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Privilege" ALTER COLUMN "uid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Project" ALTER COLUMN "uid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "uid" SET NOT NULL;

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "uid" SET NOT NULL;
