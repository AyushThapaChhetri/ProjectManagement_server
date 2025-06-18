import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";
import "dotenv/config";

const prisma = new PrismaClient();
const SALT_ROUNDS = 10;

async function main() {
  // 1. Clear existing data (optional - use with caution)
  await prisma.$transaction([
    prisma.rolePrivilege.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.refreshToken.deleteMany(),
    prisma.task.deleteMany(),
    prisma.project.deleteMany(),
    prisma.user.deleteMany(),
    prisma.privilege.deleteMany(),
    prisma.role.deleteMany(),
  ]);

  // 2. Seed Privileges
  const privileges = [
    // User Management
    { name: "create_user", description: "Create new users" },
    { name: "read_user", description: "View user information" },
    { name: "update_user", description: "Modify user information" },
    { name: "delete_user", description: "Remove users" },

    // Project Management
    { name: "create_project", description: "Create new projects" },
    { name: "read_project", description: "View project details" },
    { name: "update_project", description: "Modify project details" },
    { name: "delete_project", description: "Remove projects" },

    // Task Management
    { name: "create_task", description: "Create new tasks" },
    { name: "read_task", description: "View task details" },
    { name: "update_task", description: "Modify task details" },
    { name: "delete_task", description: "Remove tasks" },
    { name: "assign_task", description: "Assign tasks to users" },
    { name: "update_task_status", description: "Change the status of tasks" },

    // System Management
    {
      name: "manage_system_settings",
      description: "Modify system-wide configurations",
    },
  ];

  await prisma.privilege.createMany({ data: privileges });

  // 3. Seed Roles
  await prisma.role.createMany({
    data: [
      { name: "Super Admin" },
      { name: "Admin" },
      { name: "Project Manager" },
      { name: "Team Lead" },
      { name: "Employee" },
    ],
  });

  // 4. Map Role-Privilege Relationships
  const rolePrivilegeMapping = {
    "Super Admin": privileges.map((p) => p.name),
    Admin: [
      "create_user",
      "read_user",
      "update_user",
      "delete_user",
      "create_project",
      "read_project",
      "update_project",
      "delete_project",
      "manage_system_settings",
    ],
    "Project Manager": [
      "create_project",
      "read_project",
      "update_project",
      "delete_project",
      "create_task",
      "read_task",
      "update_task",
      "delete_task",
      "assign_task",
      "update_task_status",
    ],
    "Team Lead": [
      "create_task",
      "read_task",
      "update_task",
      "assign_task",
      "update_task_status",
    ],
    Employee: ["read_task", "update_task_status"],
  };

  for (const [roleName, privNames] of Object.entries(rolePrivilegeMapping)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });

    const privileges = await prisma.privilege.findMany({
      where: { name: { in: privNames } },
    });

    await prisma.rolePrivilege.createMany({
      data: privileges.map((privilege) => ({
        roleId: role.id,
        privilegeId: privilege.id,
      })),
    });
  }

  // 5. Create Super Admin (let Prisma generate uid)
  const superAdmin = await prisma.user.create({
    data: {
      firstName: "System",
      lastName: "Admin",
      email: "superadmin@company.com",
      password: await bcrypt.hash(
        process.env.SUPER_ADMIN_PASSWORD!,
        SALT_ROUNDS
      ),
      gender: "male",
      dob: new Date(1985, 0, 1),
      userRoles: {
        create: {
          role: {
            connect: { name: "Super Admin" },
          },
        },
      },
    },
  });

  // 6. Create Sample Team Structure (let Prisma generate uid)
  const projectManager = await createUserWithRole(
    "Project",
    "Manager",
    "pm@company.com",
    "Project Manager"
  );

  const teamLead = await createUserWithRole(
    "Team",
    "Lead",
    "lead@company.com",
    "Team Lead"
  );

  const developer = await createUserWithRole(
    "John",
    "Developer",
    "dev@company.com",
    "Employee"
  );

  // 7. Create Sample Project
  const project = await prisma.project.create({
    data: {
      name: "E-commerce Platform",
      description: "Next-gen online shopping system",
      deadline: new Date(2024, 11, 31),
      managerId: projectManager.id,
      tasks: {
        create: [
          {
            name: "API Development",
            description: "Build RESTful endpoints",
            priority: "High",
            status: "In Progress",
            estimatedHours: 40,
            assignedToId: developer.id,
          },
        ],
      },
    },
  });
}

async function createUserWithRole(
  firstName: string,
  lastName: string,
  email: string,
  roleName: string
) {
  return prisma.user.create({
    data: {
      firstName,
      lastName,
      email,
      password: await bcrypt.hash(
        process.env.OTHER_USER_PASSWORD!,
        SALT_ROUNDS
      ),
      gender: "male",
      dob: new Date(1990, 0, 1),
      userRoles: {
        create: {
          role: {
            connect: { name: roleName },
          },
        },
      },
    },
  });
}

main()
  .catch((e) => {
    console.error("Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
