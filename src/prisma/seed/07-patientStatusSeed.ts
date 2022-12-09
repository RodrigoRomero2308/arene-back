import { PrismaClient } from '@prisma/client';
import { PatientStatus } from '@/enums/patientStatus.enum';

const seedPatientStatus = async (prisma: PrismaClient) => {
  console.log('Seeding patient status...');

  const adminUser = await prisma.user.findFirst({
    where: {
      dni: 'ADMIN',
    },
  });

  if (!adminUser) {
    throw new Error('Could not find admin user for creations');
  }

  const patientStatuses: {
    id: number;
    name: string;
  }[] = [
    {
      id: PatientStatus.NoAceptado,
      name: 'No Aceptado',
    },
    {
      id: PatientStatus.Aceptado,
      name: 'Aceptado',
    },
    {
      id: PatientStatus.EnEvaluacionOS,
      name: 'En Evaluacion Obra Social',
    },
    {
      id: PatientStatus.AltaMedica,
      name: 'Alta Medica',
    },
  ];

  const dbPatientStatuses = await prisma.patientStatus.findMany();

  let patientStatusCreated = 0;

  for (const patientStatus of patientStatuses) {
    const dbPatientStatus = dbPatientStatuses.find(
      (item) => item.name === patientStatus.name,
    );

    if (!dbPatientStatus) {
      patientStatusCreated++;
      await prisma.patientStatus.create({
        data: {
          ...patientStatus,
          created_by: adminUser.id,
        },
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`${patientStatusCreated} patient status`);
};

export default seedPatientStatus;
