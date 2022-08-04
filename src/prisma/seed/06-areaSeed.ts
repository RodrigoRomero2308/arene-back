import { PrismaClient } from '@prisma/client';

const seedAreas = async (prisma: PrismaClient) => {
  console.log('Seeding areas...');

  const adminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (!adminUser) {
    throw new Error('Could not find admin user for creations');
  }

  const areas: {
    name: string;
    description: string;
  }[] = [];

  const dbAreas = await prisma.area.findMany();

  let areasCreated = 0;

  for (const area of areas) {
    const dbArea = dbAreas.find((item) => item.name === area.name);

    if (!dbArea) {
      areasCreated++;
      await prisma.area.create({
        data: {
          ...area,
          created_by: adminUser.id,
        },
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`${areasCreated} areas`);
};

export default seedAreas;
