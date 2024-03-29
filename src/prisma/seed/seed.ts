import { PrismaClient } from '@prisma/client';
import seedRoles from '@/prisma/seed/01-rolesSeed';
import seedPermissions from '@/prisma/seed/02-permissionSeed';
import seedUsers from '@/prisma/seed/03-userSeed';
import seedRoleUsers from '@/prisma/seed/04-roleUserSeed';
import seedRolePermissions from '@/prisma/seed/05-rolesPermissionsSeed';
import seedAreas from '@/prisma/seed/06-areaSeed';
import seedPatientStatus from '@/prisma/seed/07-patientStatusSeed';
import seedPhoneType from '@/prisma/seed/08-phoneTypeSeed';
import seedDocumentationType from '@/prisma/seed/09-documentationTypeSeed';
import seedPatientInformationType from '@/prisma/seed/10-patientInformationTypeSeed';
const prisma = new PrismaClient();

async function main() {
  await seedRoles(prisma);
  await seedPermissions(prisma);
  await seedUsers(prisma);
  await seedRoleUsers(prisma);
  await seedRolePermissions(prisma);
  await seedAreas(prisma);
  await seedPatientStatus(prisma);
  await seedPhoneType(prisma);
  await seedDocumentationType(prisma);
  await seedPatientInformationType(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
