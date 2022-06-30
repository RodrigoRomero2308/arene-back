import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Permission } from '@/prisma-models/permission/permission.model';

@Injectable()
export class PermissionService {
  constructor(private readonly prismaService: PrismaService) {}

  async getPermissionsForUser(userId: number): Promise<Permission[]> {
    return this.prismaService.permission.findMany({
      where: {
        PermissionRole: {
          some: {
            role: {
              dts: null,
              RoleUser: {
                some: {
                  userId,
                },
              },
            },
          },
        },
      },
    });
  }
}
