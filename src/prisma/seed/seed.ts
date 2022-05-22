import { PrismaClient } from '@prisma/client';
import seedRoles from './01-rolesSeed';
import seedPermissions from './02-permissionSeed';
import seedUsers from './03-userSeed';
import seedRoleUsers from './04-roleUserSeed';
import seedRolePermissions from './05-rolesPermissionsSeed';
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
