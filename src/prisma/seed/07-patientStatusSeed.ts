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
      id: PatientStatus.Nuevo,
      name: 'Nuevo',
    },
    {
      id: PatientStatus.Pendiente,
      name: 'Pendiente',
    },
    {
      id: PatientStatus.Rechazado,
      name: 'Rechazado',
    },
    {
      id: PatientStatus.Aceptado,
      name: 'Aceptado',
    },
    {
      id: PatientStatus.EnTratamiento,
      name: 'EnTratamiento',
    },
    {
      id: PatientStatus.PendienteAutorizacionAlta,
      name: 'PendienteAutorizacionAlta',
    },
    {
      id: PatientStatus.AltaMedica,
      name: 'AltaMedica',
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
