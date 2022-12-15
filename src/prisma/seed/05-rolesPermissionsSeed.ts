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
        SystemRoles.Fisiatra,
        SystemRoles.Profesional,
      ],
      permissionCode: PermissionCodes.UsersRead,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AreaCreate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AreaDelete,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AreaUpdate,
    },
    {
      roleNames: [SystemRoles.Director],
      permissionCode: PermissionCodes.RoleCreate,
    },
    {
      roleNames: [SystemRoles.Director],
      permissionCode: PermissionCodes.RoleDelete,
    },
    {
      roleNames: [SystemRoles.Director],
      permissionCode: PermissionCodes.RoleUpdate,
    },
    {
      roleNames: [SystemRoles.Director],
      permissionCode: PermissionCodes.AdminRole,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AdminArea,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.RoleUserCreate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.RoleUserDelete,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.PatientCreate,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.PatientUpdate,
    },
    {
      roleNames: [
        SystemRoles.Administrador,
        SystemRoles.Fisiatra,
        SystemRoles.Profesional,
      ],
      permissionCode: PermissionCodes.PatientRead,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.ProfessionalCreate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.ProfessionalDelete,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.ProfessionalUpdate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.ProfessionalRead,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.TreatmentCreate,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.TreatmentUpdate,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.TreatmentDelete,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.TreatmentRead,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.DocumentationRead,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.DocumentationCreate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AreaProfessionalCreate,
    },
    {
      roleNames: [SystemRoles.Coordinador],
      permissionCode: PermissionCodes.AreaProfessionalDelete,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.AppointmentCreate,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.AppointmentDelete,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.AppointmentRead,
    },
    {
      roleNames: [SystemRoles.Administrador],
      permissionCode: PermissionCodes.AppointmentUpdate,
    },
    {
      roleNames: [SystemRoles.Fisiatra],
      permissionCode: PermissionCodes.ChangePatientStatus,
    },
    {
      roleNames: [SystemRoles.Fisiatra],
      permissionCode: PermissionCodes.PatientStatusRead,
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
