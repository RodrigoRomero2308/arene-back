import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';

@Injectable()
export class PatientStatusService {
  constructor(private readonly prismaService: PrismaService) {}

  async getList() {
    return this.prismaService.patientStatus.findMany({
      where: {
        dts: null,
      },
      orderBy: {
        order: 'asc',
      },
    });
  }

  async getStatusById(id: number) {
    return this.prismaService.patientStatus.findFirst({
      where: {
        id: id,
        dts: null,
      },
    });
  }
}
