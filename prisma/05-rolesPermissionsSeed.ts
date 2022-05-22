import { PrismaClient } from '@prisma/client';

const seedRolePermissions = async (prisma: PrismaClient) => {
  console.log('Seeding relations between roles and permissions...');

  const adminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (!adminUser) {
    throw new Error('Could not find admin user for creations');
  }

  const rolesPermissions: {
    roleName: string;
    permissionCode: string;
  }[] = [
    {
      roleName: 'Admin',
      permissionCode: 'ADMIN',
    },
  ];

  const dbRolePermissions = await prisma.permissionRole.findMany({
    include: {
      permission: true,
      role: true,
    },
  });

  let relationsCreated = 0;

  for (const rolePermission of rolesPermissions) {
    const dbRolePermission = dbRolePermissions.find(
      (item) =>
        item.role.name === rolePermission.roleName &&
        item.permission.code === rolePermission.permissionCode,
    );

    if (!dbRolePermission) {
      const dbRole = await prisma.role.findFirst({
        where: {
          name: rolePermission.roleName,
        },
      });

      const dbPermission = await prisma.permission.findFirst({
        where: {
          code: rolePermission.permissionCode,
        },
      });

      if (dbRole && dbPermission) {
        await prisma.permissionRole.create({
          data: {
            permissionCode: dbPermission.code,
            roleId: dbRole.id,
            created_by: adminUser.id,
          },
        });
        relationsCreated++;
      } else {
        console.warn(
          `Relation could not be created for role ${rolePermission.roleName} and permission ${rolePermission.permissionCode}`,
        );
      }
    }
  }

  console.log(`${relationsCreated} relations between roles and permissions`);
};

export default seedRolePermissions;
