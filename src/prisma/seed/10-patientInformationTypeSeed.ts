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
    {
      id: PatientInformationTypes.PacienteEstadoCambiado,
      name: 'Estado de paciente cambiado',
    },
    {
      id: PatientInformationTypes.TratamientoAsignado,
      name: 'Tratamiento asignado',
    },
    {
      id: PatientInformationTypes.TratamientoEliminado,
      name: 'Tratamiento eliminado',
    },
    {
      id: PatientInformationTypes.TurnoAsignado,
      name: 'Turno asignado',
    },
    {
      id: PatientInformationTypes.TurnoEliminado,
      name: 'Turno eliminado',
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
