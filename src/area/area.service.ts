import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UpdateAreaInput } from '@/area/DTO/updateAreaInput';
import { CreateAreaInput } from '@/area/DTO/createAreaInput';

@Injectable()
export class AreaService {
  constructor(private readonly prismaService: PrismaService) {}
  findById(id: number) {
    return this.prismaService.area.findUnique({
      where: {
        id,
      },
    });
  }

  getList() {
    return this.prismaService.area.findMany();
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
    return this.prismaService.area.update({
      where: {
        id,
      },
      data: {
        deleted_by: userId,
        dts: new Date(),
      },
    });
  }
}
