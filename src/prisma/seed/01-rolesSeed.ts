import { Prisma, PrismaClient } from '@prisma/client';
import { SystemRoles } from '@/enums/systemRoles.enum';

const seedRoles = async (prisma: PrismaClient) => {
  console.log('Seeding roles...');
  const roles: Prisma.RoleCreateInput[] = [
    {
      name: SystemRoles.Admin,
    },
    {
      name: SystemRoles.Administrador,
    },
    {
      name: SystemRoles.Coordinador,
    },
    {
      name: SystemRoles.Director,
    },
    {
      name: SystemRoles.Fisiatra,
    },
    {
      name: SystemRoles.Paciente,
    },
    {
      name: SystemRoles.Profesional,
    },
  ];

  for (const role of roles) {
    /* Todos son roles del sistema */
    role.isSystemRole = true;
  }

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
    } else if (!dbRole.isSystemRole) {
      await prisma.role.update({
        data: {
          isSystemRole: true,
        },
        where: {
          id: dbRole.id,
        },
      });
    }
  }

  console.log(`Created ${rolesCreated} roles`);
};

export default seedRoles;
