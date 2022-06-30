import { PrismaClient } from '@prisma/client';
import seedRoles from '@/prisma/seed/01-rolesSeed';
import seedPermissions from '@/prisma/seed/02-permissionSeed';
import seedUsers from '@/prisma/seed/03-userSeed';
import seedRoleUsers from '@/prisma/seed/04-roleUserSeed';
import seedRolePermissions from '@/prisma/seed/05-rolesPermissionsSeed';
const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedPermissions(prisma);
  await seedUsers(prisma);
  await seedRoleUsers(prisma);
  await seedRolePermissions(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
