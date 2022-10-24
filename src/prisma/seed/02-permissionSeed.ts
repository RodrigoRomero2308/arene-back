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
    {
      code: PermissionCodes.AreaCreate,
      shortname: 'Area Create',
      description: 'Permission to create areas',
    },
    {
      code: PermissionCodes.AreaUpdate,
      shortname: 'Area Update',
      description: 'Permission to update areas',
    },
    {
      code: PermissionCodes.AreaDelete,
      shortname: 'Area Delete',
      description: 'Permission to delete areas',
    },
    {
      code: PermissionCodes.RoleCreate,
      shortname: 'Role Create',
      description: 'Permission to create Roles',
    },
    {
      code: PermissionCodes.RoleUpdate,
      shortname: 'Role Update',
      description: 'Permission to update Roles',
    },
    {
      code: PermissionCodes.RoleDelete,
      shortname: 'Role Delete',
      description: 'Permission to delete Roles',
    },
    {
      code: PermissionCodes.AdminRole,
      shortname: 'Administrate Roles',
      description: 'Permission needed to access areas roles page',
    },
    {
      code: PermissionCodes.AdminArea,
      shortname: 'Administrate Areas',
      description: 'Permission needed to access areas admin page',
    },
    {
      code: PermissionCodes.RoleUserCreate,
      shortname: 'RoleUser Create',
      description: 'Permission to create RoleUsers',
    },
    {
      code: PermissionCodes.RoleUserDelete,
      shortname: 'RoleUser Delete',
      description: 'Permission to delete RoleUsers',
    },
    {
      code: PermissionCodes.PatientRead,
      shortname: 'Patient Read',
      description: 'Permission to read patient data',
    },
    {
      code: PermissionCodes.PatientCreate,
      shortname: 'Patient Create',
      description: 'Permission to create patients',
    },
    {
      code: PermissionCodes.PatientUpdate,
      shortname: 'Patient Update',
      description: 'Permission to update patients',
    },
    {
      code: PermissionCodes.ProfessionalCreate,
      shortname: 'Professional Create',
      description: 'Permission to create professional',
    },
    {
      code: PermissionCodes.ProfessionalDelete,
      shortname: 'Profesional Delete',
      description: 'Permission to delete professional',
    },
    {
      code: PermissionCodes.ProfessionalUpdate,
      shortname: 'Professional update',
      description: 'Permission to update professional',
    },
    {
      code: PermissionCodes.ProfessionalRead,
      shortname: 'Professional read',
      description: 'Permission to read profesionals',
    },
    {
      code: PermissionCodes.TreatmentCreate,
      shortname: 'Treatment Create',
      description: 'Permission to create treatments',
    },
    {
      code: PermissionCodes.TreatmentDelete,
      shortname: 'Treatment Delete',
      description: 'Permission to delete treatments',
    },
    {
      code: PermissionCodes.TreatmentUpdate,
      shortname: 'Treatment Update',
      description: 'Permission to update treatments',
    },
    {
      code: PermissionCodes.TreatmentRead,
      shortname: 'Treatment Read',
      description: 'Permission to read treatments',
    },
    {
      code: PermissionCodes.DocumentationRead,
      shortname: 'Documentation read',
      description: 'Permission to read documentation from patients',
    },
    {
      code: PermissionCodes.DocumentationCreate,
      shortname: 'Documentation create',
      description: 'Permission to create documentation',
    },
    {
      code: PermissionCodes.AppointmentCreate,
      shortname: 'Appointment create',
      description: 'Permission to create appointments',
    },
    {
      code: PermissionCodes.AppointmentDelete,
      shortname: 'Appointment delete',
      description: 'Permission to delete appointments',
    },
    {
      code: PermissionCodes.AppointmentUpdate,
      shortname: 'Appointment update',
      description: 'Permission to update appointments',
    },
    {
      code: PermissionCodes.AppointmentRead,
      shortname: 'Appointment read',
      description: 'Permission to read appointments',
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
