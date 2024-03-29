import { PatientInformationTypes } from '@/enums/patientInformationType.enum';
import { PatientStatus } from '@/enums/patientStatus.enum';
import { SystemRoles } from '@/enums/systemRoles.enum';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePatientInput } from './DTO/createPatientInput';
import { PatientFilter } from './DTO/patient.filter';
import { UpdatePatientInput } from './DTO/updatePatientInput';

@Injectable()
export class PatientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  private include: Prisma.PatientInclude = {
    user: {
      include: {
        address: true,
      },
    },
  };

  findById(id: number) {
    return this.prismaService.patient.findFirst({
      where: {
        user_id: id,
        AND: [
          {
            dts: null,
          },
          {
            user: {
              dts: null,
            },
          },
        ],
      },
      include: this.include,
    });
  }

  private getPrismaParameters({ filter = {} }: { filter?: PatientFilter }) {
    const filtersToApply: Prisma.PatientWhereInput[] = [];

    const { dni, email, name, area_id, patient_status_id } = filter;

    if (dni)
      filtersToApply.push({
        user: {
          dni: {
            contains: dni,
          },
        },
      });

    if (email)
      filtersToApply.push({
        user: {
          email: {
            contains: email,
          },
        },
      });

    if (name)
      filtersToApply.push({
        user: {
          OR: [
            {
              firstname: {
                contains: name,
              },
            },
            {
              lastname: {
                contains: name,
              },
            },
          ],
        },
      });

    if (area_id)
      filtersToApply.push({
        Treatment: {
          some: {
            AND: {
              area_id: area_id,
              dts: null,
            },
          },
        },
      });

    if (patient_status_id)
      filtersToApply.push({
        patient_status_id,
      });

    return filtersToApply;
  }

  getList({
    filter,
    skip,
    take,
  }: {
    filter?: PatientFilter;
    skip?: number;
    take?: number;
  }) {
    const whereFilters = this.getPrismaParameters({
      filter,
    });

    return this.prismaService.patient.findMany({
      where: {
        AND: [
          {
            dts: null,
          },
          {
            user: {
              dts: null,
            },
          },
          ...whereFilters,
        ],
      },
      include: this.include,
      skip,
      take,
    });
  }

  async create(input: CreatePatientInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { patient, address, phone_type_id, ...createUserInput } = input;

    const patientRole = await this.prismaService.role.findFirst({
      where: {
        dts: null,
        name: SystemRoles.Paciente,
      },
    });

    if (!patientRole) {
      throw new InternalServerErrorException(
        undefined,
        'Patient role not found',
      );
    }

    const result = await this.prismaService.user.create({
      data: {
        ...createUserInput,
        active: true,
        createdBy: {
          connect: {
            id: userId,
          },
        },
        Patient: {
          create: {
            ...patient,
            created_by: userId,
            patient_status_id: PatientStatus.EnEvaluacionOS,
            PatientInformation: {
              create: {
                patient_information_type_id:
                  PatientInformationTypes.PacienteCreado,
                information: 'Paciente creado',
                created_by: userId,
              },
            },
          },
        },
        RoleUser: {
          create: {
            roleId: patientRole.id,
          },
        },
        ...(address
          ? {
              address: {
                create: {
                  ...address,
                  created_by: userId,
                },
              },
            }
          : {}),
        phoneType: phone_type_id
          ? {
              connect: {
                id: phone_type_id,
              },
            }
          : undefined,
      },
      select: {
        id: true,
      },
    });

    return this.findById(result.id);
  }

  async update(id: number, input: UpdatePatientInput, userId: number) {
    await this.usersService.validateUpdate(
      {
        dni: input.dni || '',
        email: input.email || '',
      },
      {
        excludeDni: !!input.dni,
        excludeEmail: !!input.email,
        excludeUserId: id,
      },
    );

    if (input.password) {
      input.password = await this.hashService.hash(input.password);
    }

    const { patient, address, phone_type_id, ...updateUserInput } = input;

    await this.prismaService.user.update({
      data: {
        ...updateUserInput,
        uts: new Date(),
        updatedBy: {
          connect: {
            id: userId,
          },
        },
        Patient: {
          update: {
            where: {
              user_id: id,
            },
            data: {
              ...patient,
              updated_by: userId,
              uts: new Date(),
              PatientInformation: {
                create: {
                  patient_information_type_id:
                    PatientInformationTypes.PacienteActualizado,
                  information: 'Datos del paciente actualizados',
                  created_by: userId,
                },
              },
            },
          },
        },
        ...(address
          ? {
              address: {
                update: {
                  ...address,
                  updated_by: userId,
                  uts: new Date(),
                },
              },
            }
          : {}),
        phoneType: phone_type_id
          ? {
              connect: {
                id: phone_type_id,
              },
            }
          : undefined,
      },
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });

    return this.findById(id);
  }

  async changeStatus(id: number, statusId: number, userId: number) {
    const patientPromise = this.prismaService.patient.findFirst({
      where: {
        user_id: id,
        dts: null,
      },
      include: {
        patientStatus: true,
      },
    });
    const statusToChangeToPromise = this.prismaService.patientStatus.findFirst({
      where: {
        id: statusId,
        dts: null,
      },
    });

    const [patient, statusToChangeTo] = await Promise.all([
      patientPromise,
      statusToChangeToPromise,
    ]);

    if (!statusToChangeTo || !patient) {
      throw new BadRequestException();
    }

    await this.prismaService.patient.update({
      data: {
        patient_status_id: statusId,
        updated_by: userId,
        uts: new Date(),
        PatientInformation: {
          create: {
            information: `Estado cambiado de ${patient.patientStatus.name} a ${statusToChangeTo.name}`,
            patient_information_type_id:
              PatientInformationTypes.PacienteEstadoCambiado,
            created_by: userId,
          },
        },
      },
      where: {
        user_id: id,
      },
    });

    return this.findById(id);
  }
}
