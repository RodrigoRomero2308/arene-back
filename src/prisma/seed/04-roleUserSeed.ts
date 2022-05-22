import { PrismaClient } from '@prisma/client';

const seedRoleUsers = async (prisma: PrismaClient) => {
  console.log('Seeding relations between roles and users...');
  const roleUsers: {
    roleName: string;
    userDni: string;
  }[] = [
    {
      roleName: 'Admin',
      userDni: 'ADMIN',
    },
  ];

  const dbRoleUsers = await prisma.roleUser.findMany({
    include: {
      role: true,
      user: true,
    },
  });

  let relationsCreated = 0;

  for (const roleUser of roleUsers) {
    const dbRoleUser = dbRoleUsers.find(
      (item) =>
        item.role.name === roleUser.roleName &&
        item.user.dni === roleUser.userDni,
    );

    if (!dbRoleUser) {
      const dbRole = await prisma.role.findFirst({
        where: {
          name: roleUser.roleName,
        },
      });

      const dbUser = await prisma.user.findFirst({
        where: {
          dni: roleUser.userDni,
        },
      });

      if (dbRole && dbUser) {
        await prisma.roleUser.create({
          data: {
            roleId: dbRole.id,
            userId: dbUser.id,
          },
        });
        relationsCreated++;
      } else {
        console.warn(
          `Relation could not be created for role ${roleUser.roleName}, user ${roleUser.userDni}`,
        );
      }
    }
  }

  console.log(`${relationsCreated} relations between roles and user created`);
};

export default seedRoleUsers;
