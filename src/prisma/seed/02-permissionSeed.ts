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
