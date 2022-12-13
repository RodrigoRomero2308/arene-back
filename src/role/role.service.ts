import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateRoleInput } from './dto/create-role.input';
import { RoleFilter } from './dto/role.filter';
import { UpdateRoleInput } from './dto/update-role.input';

@Injectable()
export class RoleService {
  constructor(private readonly prismaService: PrismaService) {}
  getRoleById(id: number) {
    return this.prismaService.role.findUnique({
      where: {
        id,
      },
    });
  }

  private getPrismaParameters({ filter = {} }: { filter?: RoleFilter }) {
    const filtersToApply: Prisma.RoleWhereInput[] = [];

    const { isProfessionalRole } = filter;

    if (isProfessionalRole == false)
      filtersToApply.push({
        isProfessionalRole: false,
      });
    if (isProfessionalRole == true)
      filtersToApply.push({
        isProfessionalRole: true,
      });

    return filtersToApply;
  }

  getRoles({ filter }: { filter?: RoleFilter }) {
    const whereFilters = this.getPrismaParameters({ filter });

    return this.prismaService.role.findMany({
      where: {
        AND: [
          {
            dts: null,
          },
          {
            name: { not: 'Admin' },
          },
          ...whereFilters,
        ],
      },
    });
  }

  async checkRoleName({
    name,
    excludeRoleId,
  }: {
    name: string;
    excludeRoleId?: number;
  }) {
    const rolesWithSameName = await this.prismaService.role.count({
      where: {
        name,
        id: excludeRoleId
          ? {
              not: {
                equals: excludeRoleId,
              },
            }
          : undefined,
        deleted_by: null,
      },
    });

    if (rolesWithSameName) {
      throw new Error('Nombre de área ya utilizado');
    }
  }

  async createRole(input: CreateRoleInput, userId: number) {
    await this.checkRoleName({
      name: input.name,
    });

    return this.prismaService.role.create({
      data: {
        ...input,
        created_by: userId,
      },
    });
  }

  async updateRole(id: number, input: UpdateRoleInput, userId: number) {
    if (input.name) {
      await this.checkRoleName({
        name: input.name,
        excludeRoleId: id,
      });
    }

    return this.prismaService.role.update({
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

  async deleteRole(id: number, userId: number) {
    return this.prismaService.role.update({
      where: {
        id,
      },
      data: {
        deleted_by: userId,
        dts: new Date(),
      },
    });
  }

  async getRoleByName(name: string) {
    return this.prismaService.role.findFirst({
      where: {
        name: name,
      },
    });
  }
}
