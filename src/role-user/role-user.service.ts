import { RoleUserUserIdRoleIdCompoundUniqueInput } from '@/prisma-models/role-user/role-user-user-id-role-id-compound-unique.input';
import { PrismaService } from '@/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { CreateRoleUserInput } from './dto/create-role-user.input';

@Injectable()
export class RoleUserService {
  constructor(private readonly prismaService: PrismaService) {}

  async checkRoleUser({ userId, roleId }: { userId: number; roleId: number }) {
    const roleUserExist = await this.prismaService.roleUser.count({
      where: {
        userId: userId,
        roleId: roleId,
        deleted_by: null,
      },
    });

    const roleUserExistButIsDelete = await this.prismaService.roleUser.count({
      where: {
        userId: userId,
        roleId: roleId,
      },
    });

    const roleExist = await this.prismaService.role.count({
      where: {
        id: roleId,
        deleted_by: null,
      },
    });

    const userExist = await this.prismaService.user.count({
      where: {
        id: userId,
      },
    });

    if (roleExist == 0) {
      throw new Error('Id de rol inexistente');
    }
    if (userExist == 0) {
      throw new Error('Id de usuario inexistente');
    }
    if (roleUserExist) {
      throw new Error(
        `Relacion ya existente entre usuario ${userId} y rol ${roleId}}`,
      );
    }
    if (roleUserExistButIsDelete) {
      return false;
    }
    return true;
  }

  async checkExistOtherRoleUser(userId: number) {
    const roleUserCount = await this.prismaService.roleUser.count({
      where: {
        userId: userId,
        deleted_by: null,
      },
    });

    if (roleUserCount <= 1) {
      throw new Error(`No se puede eliminar mas roles`);
    }
  }

  async createRoleUser(input: CreateRoleUserInput, userId: number) {
    const checkRoleUserExist = await this.checkRoleUser({
      userId: input.userId,
      roleId: input.roleId,
    });

    if (!checkRoleUserExist) {
      return this.prismaService.roleUser.update({
        where: {
          userId_roleId: {
            roleId: input.roleId,
            userId: input.userId,
          },
        },
        data: {
          deleted_by: null,
          dts: null,
        },
      });
    }
    return this.prismaService.roleUser.create({
      data: {
        ...input,
        created_by: userId,
      },
    });
  }

  async deleteRoleUser(
    input: RoleUserUserIdRoleIdCompoundUniqueInput,
    userId: number,
  ) {
    this.checkExistOtherRoleUser(input.userId);
    return this.prismaService.roleUser.update({
      where: {
        userId_roleId: input,
      },
      data: {
        deleted_by: userId,
        dts: new Date(),
      },
    });
  }

  async getRoleUsersByUserId(userId: number) {
    return this.prismaService.roleUser.findMany({
      where: {
        userId: userId,
        deleted_by: null,
      },
      include: {
        role: true,
      },
    });
  }
}
