import { PrismaClient } from '@prisma/client';

const seedDocumentationType = async (prisma: PrismaClient) => {
  console.log('Seeding documentation types...');

  const adminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (!adminUser) {
    throw new Error('Could not find admin user for creations');
  }

  const documentationTypes: {
    name: string;
    required: boolean;
  }[] = [
    {
      name: 'Certificado Único de Discapacidad',
      required: true,
    },
    {
      name: 'Credencial Obra Social',
      required: true,
    },
    {
      name: 'Derivación médica',
      required: true,
    },
    {
      name: 'Historia Clínica',
      required: true,
    },
    {
      name: 'DNI frente',
      required: true,
    },
    {
      name: 'DNI dorso',
      required: true,
    },
  ];

  const dbDocumentationTypes = await prisma.documentationType.findMany();

  let documentationTypesCreated = 0;

  for (const documentationType of documentationTypes) {
    const dbDocumentationType = dbDocumentationTypes.find(
      (item) => item.name === documentationType.name,
    );

    if (!dbDocumentationType) {
      documentationTypesCreated++;
      await prisma.documentationType.create({
        data: {
          ...documentationType,
          created_by: adminUser.id,
        },
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`${documentationTypesCreated} documentation types`);
};

export default seedDocumentationType;
