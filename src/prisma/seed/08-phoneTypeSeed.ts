import { PrismaClient } from '@prisma/client';
import { PhoneType } from '@/enums/phoneTypes.enum';

const seedPhoneType = async (prisma: PrismaClient) => {
  console.log('Seeding phone types...');

  const adminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (!adminUser) {
    throw new Error('Could not find admin user for creations');
  }

  const phoneTypes: {
    id: number;
    name: string;
  }[] = [
    {
      id: PhoneType.Fijo,
      name: 'Fijo',
    },
    {
      id: PhoneType.Celular,
      name: 'Celular',
    },
  ];

  const dbPhoneTypees = await prisma.phoneType.findMany();

  let phoneTypesCreated = 0;

  for (const phoneType of phoneTypes) {
    const dbPhoneType = dbPhoneTypees.find(
      (item) => item.name === phoneType.name,
    );

    if (!dbPhoneType) {
      phoneTypesCreated++;
      await prisma.phoneType.create({
        data: {
          ...phoneType,
          created_by: adminUser.id,
        },
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`${phoneTypesCreated} phone types`);
};

export default seedPhoneType;
