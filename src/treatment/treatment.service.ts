import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateTreatmentInput } from './dto/create-treatment.input';
import { TreatmentFilter } from './dto/treatment.filter';
import { UpdateTreatmentInput } from './dto/update-treatment.input';

@Injectable()
export class TreatmentService {
  constructor(private readonly prismaService: PrismaService) {}

  private include: Prisma.TreatmentInclude = {
    area: true,
    patient: true,
  };

  private getPrismaParameters({ filter = {} }: { filter?: TreatmentFilter }) {
    const filtersToApply: Prisma.TreatmentWhereInput[] = [];

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

  async checkTreatmentExistence(areaid: number, patientId: number) {
    const existingTreatments = await this.prismaService.treatment.count({
      where: {
        area_id: areaid,
        patient_id: patientId,
      },
    });

    if (existingTreatments) {
      throw new Error('Treatment already exists');
    }
  }

  async create(input: CreateTreatmentInput) {
    await this.checkTreatmentExistence(input.area_id, input.patient_id);

    return this.prismaService.treatment.create({
      data: {
        ...input,
      },
    });
  }

  async update(id: number, input: UpdateTreatmentInput) {
    return this.prismaService.treatment.update({
      where: {
        id,
      },
      data: {
        ...input,
      },
    });
  }

  async delete(id: number) {
    return this.prismaService.treatment.delete({
      where: {
        id,
      },
    });
  }
}
