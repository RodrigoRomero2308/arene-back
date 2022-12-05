import { OrderByDirection } from '@/common/orderBy.direction.args';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PatientInformationFilter } from './DTO/patient-information.filter';
import { PatientInformationOrderByInput } from './DTO/patient-information.orderBy';

@Injectable()
export class PatientInformationService {
  constructor(private readonly prismaService: PrismaService) {}

  include = Prisma.validator<Prisma.PatientInformationInclude>()({
    createdBy: true,
  });

  findAll({
    filter,
    orderBy,
    skip,
    take,
  }: {
    filter?: PatientInformationFilter;
    orderBy?: PatientInformationOrderByInput;
    skip?: number;
    take?: number;
  }) {
    const params = this.getPrismaParameters({
      filter,
      orderBy,
      skip,
      take,
    });

    return this.prismaService.patientInformation.findMany({
      ...params,
      include: this.include,
    });
  }

  getPrismaParameters({
    filter = {},
    orderBy,
    skip = 0,
    take = 20,
  }: {
    filter?: PatientInformationFilter;
    orderBy: PatientInformationOrderByInput | undefined;
    skip?: number;
    take?: number;
  }): {
    where: Prisma.PatientInformationWhereInput;
    orderBy: Prisma.PatientInformationOrderByWithRelationInput;
    skip: number;
    take: number;
  } {
    const orderByInput: Prisma.PatientInformationOrderByWithRelationInput = {};

    if (orderBy) {
      orderByInput[orderBy.field] = orderBy.direction;
    } else {
      orderByInput.its = OrderByDirection.desc;
    }

    const { created_by, date_from, date_to, patient_id } = filter;

    const whereInput: Prisma.PatientInformationWhereInput = {};

    if (patient_id) whereInput.patient_id = patient_id;
    if (created_by) whereInput.created_by = created_by;
    if (date_from || date_to) {
      whereInput.its = {
        gte: date_from,
        lte: date_to,
      };
    }

    return {
      where: whereInput,
      orderBy: orderByInput,
      skip,
      take,
    };
  }
}
