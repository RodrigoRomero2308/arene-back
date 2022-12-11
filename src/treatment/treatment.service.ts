import { PatientInformationTypes } from '@/enums/patientInformationType.enum';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTreatmentInput } from './dto/create-treatment.input';
import { TreatmentFilter } from './dto/treatment.filter';

@Injectable()
export class TreatmentService {
  constructor(private readonly prismaService: PrismaService) {}

  private include: Prisma.TreatmentInclude = {
    area: true,
    patient: true,
  };

  private getPrismaParameters({ filter = {} }: { filter?: TreatmentFilter }) {
    const filtersToApply: Prisma.TreatmentWhereInput[] = [
      {
        dts: null,
      },
    ];

    const { id, area_id, patient_id } = filter;

    if (id)
      filtersToApply.push({
        id,
      });

    if (area_id)
      filtersToApply.push({
        area_id,
      });

    if (patient_id)
      filtersToApply.push({
        patient_id,
      });

    return filtersToApply;
  }

  getList({
    filter,
    skip,
    take,
  }: {
    filter?: TreatmentFilter;
    skip?: number;
    take?: number;
  }) {
    const whereFilters = this.getPrismaParameters({
      filter,
    });

    return this.prismaService.treatment.findMany({
      where: {
        AND: whereFilters,
      },
      include: this.include,
      skip,
      take,
    });
  }

  async checkTreatmentExistence(
    areaid: number,
    patientId: number,
    excludeId?: number,
  ) {
    const existingTreatments = await this.prismaService.treatment.count({
      where: {
        area_id: areaid,
        patient_id: patientId,
        id: excludeId ? { not: excludeId } : undefined,
        dts: null,
      },
    });

    if (existingTreatments) {
      throw new Error('El tratamiento ingresado ya existe');
    }
  }

  async create(input: CreateTreatmentInput, user: AuthenticatedUser) {
    const area = await this.prismaService.area.findFirst({
      where: {
        id: input.area_id,
        dts: null,
      },
    });

    if (!area) {
      throw new BadRequestException(
        'El area indicada para el tratamiento no existe',
      );
    }

    await this.checkTreatmentExistence(input.area_id, input.patient_id);

    const [result] = await this.prismaService.$transaction([
      this.prismaService.treatment.create({
        data: {
          ...input,
          created_by: user.id,
        },
      }),
      this.prismaService.patientInformation.create({
        data: {
          information: `Tratamiento asignado en el area ${area.name}`,
          patient_information_type_id:
            PatientInformationTypes.TratamientoAsignado,
          patient_id: input.patient_id,
          created_by: user.id,
        },
      }),
    ]);

    return result;
  }

  async delete(id: number, user: AuthenticatedUser) {
    const treatment = await this.prismaService.treatment.findFirst({
      where: {
        id,
        dts: null,
      },
      include: {
        area: true,
      },
    });

    if (!treatment) {
      throw new BadRequestException('El tratamiento indicado, no existe');
    }

    const [result] = await this.prismaService.$transaction([
      this.prismaService.treatment.update({
        where: {
          id,
        },
        data: {
          dts: new Date(),
          deleted_by: user.id,
          Appointment: {
            updateMany: [
              {
                data: {
                  dts: new Date(),
                  deleted_by: user.id,
                },
                where: {
                  dts: null,
                },
              },
            ],
          },
        },
      }),
      this.prismaService.patientInformation.create({
        data: {
          information: `Tratamiento eliminado en el area ${treatment.area.name}`,
          created_by: user.id,
          patient_information_type_id:
            PatientInformationTypes.TratamientoEliminado,
          patient_id: treatment.patient_id,
        },
      }),
    ]);

    return result;
  }
}
