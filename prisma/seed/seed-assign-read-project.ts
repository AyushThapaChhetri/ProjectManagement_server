import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const privilegeName = "read_project";
  const targetRoles = ["Team Lead", "Employee"];

  const privilege = await prisma.privilege.findUniqueOrThrow({
    where: { name: privilegeName },
  });

  for (const roleName of targetRoles) {
    const role = await prisma.role.findUniqueOrThrow({
      where: { name: roleName },
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

    console.log(` Assigned '${privilegeName}' to role '${roleName}'`);
  }
}

main()
  .catch((e) => {
    console.error(" Failed to assign privilege:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
