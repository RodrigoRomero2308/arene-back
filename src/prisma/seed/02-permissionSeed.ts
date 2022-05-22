import { Prisma, PrismaClient } from '@prisma/client';

const seedPermissions = async (prisma: PrismaClient) => {
  console.log('Seeding permissions...');
  const permissions: Prisma.PermissionCreateInput[] = [
    {
      code: 'ADMIN',
      shortname: 'Admin permission',
      description: 'Permission for admin users',
    },
  ];

  const dbPermissions = await prisma.permission.findMany();
  let permissionsCreated = 0;

  for (const permission of permissions) {
    const dbPermission = dbPermissions.find(
      (item) => item.code === permission.code,
    );

    if (!dbPermission) {
      permissionsCreated++;
      await prisma.permission.create({
        data: permission,
      });
    }
  }

  console.log(`Created ${permissionsCreated} permissions`);
};

export default seedPermissions;
