import { Prisma, PrismaClient } from '@prisma/client';
import { PermissionCodes } from '@/enums/permissionCodes.enum';

const seedPermissions = async (prisma: PrismaClient) => {
  console.log('Seeding permissions...');
  const permissions: Prisma.PermissionCreateInput[] = [
    {
      code: PermissionCodes.Admin,
      shortname: 'Admin permission',
      description: 'Permission for admin users',
    },
    {
      code: PermissionCodes.UsersRead,
      shortname: 'Users Read',
      description: 'Permission to query users',
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
