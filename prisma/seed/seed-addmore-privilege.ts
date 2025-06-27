import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const newPrivileges = [
    {
      name: "reorder_tasks",
      description: "Reorder tasks within the same list",
    },
    { name: "assign_task_to_user", description: "Assign a task to a user" },
    {
      name: "assign_project_to_user",
      description: "Assign a project to a user",
    },
  ];

  for (const priv of newPrivileges) {
    await prisma.privilege.upsert({
      where: { name: priv.name },
      update: { description: priv.description },
      create: { name: priv.name, description: priv.description },
    });
  }

  const rolePrivilegeMapping: Record<string, string[]> = {
    "Super Admin": newPrivileges.map((p) => p.name),
    Admin: newPrivileges.map((p) => p.name),
    "Project Manager": newPrivileges.map((p) => p.name),
    "Team Lead": ["reorder_tasks", "assign_task_to_user"],
    Employee: [],
  };

  for (const [roleName, privilegeNames] of Object.entries(
    rolePrivilegeMapping
  )) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
    });

    for (const privilegeName of privilegeNames) {
      const privilege = await prisma.privilege.findUniqueOrThrow({
        where: { name: privilegeName },
      });

      await prisma.rolePrivilege.upsert({
        where: {
          roleId_privilegeId: {
            roleId: role.id,
            privilegeId: privilege.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          privilegeId: privilege.id,
        },
      });
    }
  }

  console.log(
    "New task and project assignment privileges seeded and assigned."
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
