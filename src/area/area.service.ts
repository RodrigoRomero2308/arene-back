import { PrismaService } from '@/prisma/prisma.service';
import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { UpdateAreaInput } from '@/area/DTO/updateAreaInput';
import { CreateAreaInput } from '@/area/DTO/createAreaInput';

@Injectable()
export class AreaService {
  constructor(private readonly prismaService: PrismaService) {}
  findById(id: number) {
    return this.prismaService.area.findFirst({
      where: {
        id,
        dts: null,
      },
    });
  }

  getList() {
    return this.prismaService.area.findMany({
      where: {
        dts: null,
      },
    });
  }

  async checkAreaName({
    name,
    excludeAreaId,
  }: {
    name: string;
    excludeAreaId?: number;
  }) {
    const areasWithSameName = await this.prismaService.area.count({
      where: {
        name,
        id: excludeAreaId
          ? {
              not: {
                equals: excludeAreaId,
              },
            }
          : undefined,
        deleted_by: null,
      },
    });

    if (areasWithSameName) {
      throw new Error('Nombre de área ya utilizado');
    }
  }

  async create(input: CreateAreaInput, userId: number) {
    await this.checkAreaName({
      name: input.name,
    });

    return this.prismaService.area.create({
      data: {
        ...input,
        created_by: userId,
      },
    });
  }

  async update(id: number, input: UpdateAreaInput, userId: number) {
    if (input.name) {
      await this.checkAreaName({
        name: input.name,
        excludeAreaId: id,
      });
    }

    return this.prismaService.area.update({
      where: {
        id,
      },
      data: {
        ...input,
        updated_by: userId,
        uts: new Date(),
      },
    });
  }

  async delete(id: number, userId: number) {
    const [result] = await this.prismaService.$transaction([
      this.prismaService.area.update({
        where: {
          id,
        },
        data: {
          deleted_by: userId,
          dts: new Date(),
        },
      }),
      this.prismaService.professionalArea.deleteMany({
        where: {
          area_id: id,
        },
      }),
      this.prismaService.treatment.updateMany({
        where: {
          area_id: id,
        },
        data: {
          dts: new Date(),
          deleted_by: userId,
        },
      }),
    ]);

    return result;
  }

  async getAreaByAreaName(areaName: string) {
    await this.prismaService.area.findFirst({
      where: {
        name: areaName,
      },
    });
  }

  async getAreaActiveRelations(id: number) {
    const area = await this.prismaService.area.findFirst({
      where: {
        id,
        dts: null,
      },
    });

    if (!area) {
      throw new InternalServerErrorException('Area no encontrada');
    }

    const [treatmentCount, professionalAreaCount] = await Promise.all([
      this.prismaService.treatment.count({
        where: {
          dts: null,
          area_id: id,
          patient: {
            dts: null,
            user: {
              dts: null,
            },
          },
        },
      }),
      this.prismaService.professionalArea.count({
        where: {
          area_id: id,
          professional: {
            dts: null,
          },
        },
      }),
    ]);

    const relationsWithCount = [];

    if (treatmentCount) {
      relationsWithCount.push('treatment');
    }

    if (professionalAreaCount) {
      relationsWithCount.push('professionalArea');
    }

    return relationsWithCount;
  }
}
