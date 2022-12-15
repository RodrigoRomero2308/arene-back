import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DocumentationTypeService {
  constructor(private readonly prismaService: PrismaService) {}

  getList() {
    return this.prismaService.documentationType.findMany({
      where: {
        dts: null,
      },
    });
  }
}
