// migrations/add-override-permissions.ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // 1. Create the new privilege if it doesn't exist
  const privilege = await prisma.privilege.upsert({
    where: { name: "override_permissions" }, // 1. Look for an existing record
    update: {}, // 2. If found, update it
    create: {
      // 3. If not found, create it
      name: "override_permissions",
      description: "Create/update/delete roles & privileges",
    },
  });

  // 2. Find Super Admin role
  const superAdminRole = await prisma.role.findUniqueOrThrow({
    where: { name: "Super Admin" },
  });

  // 3. Connect privilege to Super Admin if not already linked
  await prisma.rolePrivilege.upsert({
    where: {
      roleId_privilegeId: {
        roleId: superAdminRole.id,
        privilegeId: privilege.id,
      },
    },
    update: {},
    create: {
      roleId: superAdminRole.id,
      privilegeId: privilege.id,
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
