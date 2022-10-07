import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateTreatmentInput } from './dto/create-treatment.input';
import { UpdateTreatmentInput } from './dto/update-treatment.input';

@Injectable()
export class TreatmentService {
  constructor(private readonly prismaService: PrismaService) {}

  findById(id: number) {
    return this.prismaService.treatment.findFirst({
      where: {
        id,
      },
    });
  }

  findByUserId(userId: number) {
    return this.prismaService.treatment.findMany({
      where: {
        patient_id: userId,
      },
    });
  }

  findByAreaId(areaId: number) {
    return this.prismaService.treatment.findMany({
      where: {
        area_id: areaId,
      },
    });
  }

  getList() {
    return this.prismaService.treatment.findMany();
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
    if (input.area_id && input.patient_id) {
      await this.checkTreatmentExistence(input.area_id, input.patient_id);
    }

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
