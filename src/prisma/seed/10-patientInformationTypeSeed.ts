import { PatientInformationTypes } from '@/enums/patientInformationType.enum';
import { PrismaClient } from '@prisma/client';

const seedPatientInformationType = async (prisma: PrismaClient) => {
  console.log('Seeding patient information types...');

  const patientInformationTypes: {
    id: number;
    name: string;
  }[] = [
    {
      id: PatientInformationTypes.PacienteCreado,
      name: 'Paciente creado',
    },
    {
      id: PatientInformationTypes.PacienteActualizado,
      name: 'Paciente actualizado',
    },
    {
      id: PatientInformationTypes.DocumentacionAgregada,
      name: 'Documentación agregada',
    },
  ];

  const dbPatientInformationTypes =
    await prisma.patientInformationType.findMany();

  let patientInformationTypesCreated = 0;

  for (const patientInformationType of patientInformationTypes) {
    const dbPatientInformationType = dbPatientInformationTypes.find(
      (item) => item.id === patientInformationType.id,
    );

    if (!dbPatientInformationType) {
      patientInformationTypesCreated++;
      await prisma.patientInformationType.create({
        data: {
          ...patientInformationType,
        },
        select: {
          id: true,
        },
      });
    }
  }

  console.log(`${patientInformationTypesCreated} patient information types`);
};

export default seedPatientInformationType;
