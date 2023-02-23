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
    color: string;
  }[] = [
    {
      id: PatientStatus.NoAceptado,
      name: 'No Aceptado',
      color: 'red',
    },
    {
      id: PatientStatus.Aceptado,
      name: 'Aceptado',
      color: 'green',
    },
    {
      id: PatientStatus.EnEvaluacionOS,
      name: 'En Evaluacion Obra Social',
      color: 'cyan',
    },
    {
      id: PatientStatus.AltaMedica,
      name: 'Alta Médica',
      color: 'yellow',
    },
  ];

  const dbPatientStatuses = await prisma.patientStatus.findMany();

  let patientStatusCreated = 0;
  let patientStatusUpdated = 0;

  for (const patientStatus of patientStatuses) {
    const dbPatientStatus = dbPatientStatuses.find(
      (item) => item.id === patientStatus.id,
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
    } else if (
      dbPatientStatus.name !== patientStatus.name ||
      dbPatientStatus.color !== patientStatus.color
    ) {
      patientStatusUpdated++;
      await prisma.patientStatus.update({
        data: {
          ...patientStatus,
          updated_by: adminUser.id,
          uts: new Date(),
        },
        where: {
          id: patientStatus.id,
        },
      });
    }
  }

  console.log(`${patientStatusCreated} patient status creados`);
  console.log(`${patientStatusUpdated} patient status actualizados`);
};

export default seedPatientStatus;
