import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleInput } from './dto/create-role.input';
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

  getRoles() {
    return this.prismaService.role.findMany({
      where: {
        AND: [
          {
            dts: null,
          },
          {
            name: { not: 'Admin' },
          },
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
