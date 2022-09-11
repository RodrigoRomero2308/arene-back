import { PatientStatus } from '@/enums/patientStatus.enum';
import { SystemRoles } from '@/enums/systemRoles.enum';
import { HashService } from '@/hash/hash.service';
import { PrismaService } from '@/prisma/prisma.service';
import { UsersService } from '@/users/users.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreatePatientInput } from './DTO/createPatientInput';
import { UpdatePatientInput } from './DTO/updatePatientInput';

@Injectable()
export class PatientService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly hashService: HashService,
  ) {}

  private include: Prisma.PatientInclude = {
    user: true,
  };

  findById(id: number) {
    return this.prismaService.patient.findFirst({
      where: {
        user_id: id,
        OR: [
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

  getList() {
    return this.prismaService.patient.findMany({
      include: this.include,
    });
  }

  async create(input: CreatePatientInput, userId: number) {
    await this.usersService.validateRegister(input);
    input.password = await this.hashService.hash(input.password);
    const { patient, ...createUserInput } = input;

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
        created_by: userId,
        Patient: {
          create: {
            ...patient,
            created_by: userId,
            patient_status_id: PatientStatus.Nuevo,
          },
        },
        RoleUser: {
          create: {
            roleId: patientRole.id,
          },
        },
      },
      select: {
        id: true,
      },
    });

    return this.findById(result.id);
  }

  async update(id: number, input: UpdatePatientInput, userId: number) {
    await this.usersService.validateRegister(
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

    const { patient, ...updateUserInput } = input;

    await this.prismaService.user.update({
      data: {
        ...updateUserInput,
        uts: new Date(),
        updated_by: userId,
        Patient: {
          update: {
            where: {
              user_id: id,
            },
            data: {
              ...patient,
              updated_by: userId,
              uts: new Date(),
            },
          },
        },
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
}
