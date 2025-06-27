// prisma/seed-list-privileges.ts

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1) Define your new list-related privileges
  const listPrivileges = [
    { name: "create_list", description: "Create a new list/column" },
    { name: "read_list", description: "Read/view lists and their tasks" },
    { name: "update_list", description: "Rename or edit a list" },
    { name: "delete_list", description: "Delete a list and its tasks" },
    { name: "reorder_list", description: "Reorder lists in the board" },
    { name: "assign_tasks", description: "Move tasks into/out of a list" },
    { name: "archive_list", description: "Archive or restore a list" },
    { name: "duplicate_list", description: "Duplicate a list with its tasks" },
  ];

  // 2) Upsert each privilege record
  for (const priv of listPrivileges) {
    await prisma.privilege.upsert({
      where: { name: priv.name },
      update: { description: priv.description },
      create: { name: priv.name, description: priv.description },
    });
  }

  // 3) Define which roles get which of these new privileges
  const roleListMapping: Record<string, string[]> = {
    "Super Admin": listPrivileges.map((p) => p.name),
    Admin: [
      "create_list",
      "read_list",
      "update_list",
      "delete_list",
      "reorder_list",
      "assign_tasks",
    ],
    "Project Manager": [
      "create_list",
      "read_list",
      "update_list",
      "delete_list",
      "reorder_list",
      "assign_tasks",
    ],
    "Team Lead": ["read_list", "reorder_list", "assign_tasks"],
    Employee: ["read_list", "assign_tasks"],
  };

  // 4) Link each privilege to each role in the RolePrivilege join table
  for (const [roleName, perms] of Object.entries(roleListMapping)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });

    for (const permName of perms) {
      const privilege = await prisma.privilege.findUniqueOrThrow({
        where: { name: permName },
      });

      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: role.id,
            privilegeId: privilege.id,
          },
        },
        update: {}, // nothing to change if it already exists
        create: {
          roleId: role.id,
          privilegeId: privilege.id,
        },
      });
    }
  }

  console.log("List privileges seeded and assigned to roles.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
