import { Prisma, PrismaClient } from '@prisma/client';

const seedRoles = async (prisma: PrismaClient) => {
  console.log('Seeding roles...');
  const roles: Prisma.RoleCreateInput[] = [
    {
      name: 'Admin',
    },
  ];
  const dbRoles = await prisma.role.findMany();
  let rolesCreated = 0;

  for (const role of roles) {
    const dbRole = dbRoles.find((item) => item.name === role.name);

    if (!dbRole) {
      rolesCreated++;
      await prisma.role.create({
        data: role,
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`Created ${rolesCreated} roles`);
};

export default seedRoles;
