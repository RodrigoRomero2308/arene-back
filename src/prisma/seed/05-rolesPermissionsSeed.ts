import { PrismaClient } from '@prisma/client';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { SystemRoles } from '@/enums/systemRoles.enum';

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
    roleNames: string[];
    permissionCode: string;
  }[] = [
    {
      roleNames: [],
      permissionCode: PermissionCodes.Admin,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Coordinador,
        SystemRoles.Director,
        SystemRoles.Fisiatra,
        SystemRoles.Profesional,
      ],
      permissionCode: PermissionCodes.UsersRead,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.AreaCreate,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.AreaDelete,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.AreaUpdate,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.RoleCreate,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.RoleDelete,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.RoleUpdate,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Director,
        SystemRoles.Coordinador,
      ],
      permissionCode: PermissionCodes.AdminArea,
    },
  ];

  /* Todos los permisos los debe tener admin */
  for (const rolePermission of rolesPermissions) {
    if (!rolePermission.roleNames.includes(PermissionCodes.Admin)) {
      rolePermission.roleNames.push(SystemRoles.Admin);
    }
  }

  const dbRolePermissions = await prisma.permissionRole.findMany({
    include: {
      permission: true,
      role: true,
    },
  });

  let relationsCreated = 0;

  for (const rolePermission of rolesPermissions) {
    for (const roleName of rolePermission.roleNames) {
      const dbRolePermission = dbRolePermissions.find(
        (item) =>
          item.role.name === roleName &&
          item.permission.code === rolePermission.permissionCode,
      );

      if (!dbRolePermission) {
        const dbRole = await prisma.role.findFirst({
          where: {
            name: roleName,
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
            `Relation could not be created for role ${roleName} and permission ${rolePermission.permissionCode}`,
          );
        }
      }
    }
  }

  console.log(`${relationsCreated} relations between roles and permissions`);
};

export default seedRolePermissions;
