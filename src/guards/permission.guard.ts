import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { REQUIRED_PERMISSIONS_KEY } from 'src/decorators/permission.decorator';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly prismaService: PrismaService,
  ) {
    // Intentional
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permissionsRequired = this.reflector.getAllAndOverride<string[]>(
      REQUIRED_PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!permissionsRequired?.length) {
      return true;
    }

    const request = GqlExecutionContext.create(context).getContext().req;

    const userId: number | undefined = request?.user?.id;

    const userPermissions = await this.prismaService.permission.findMany({
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

    if (
      permissionsRequired.every((permission) =>
        userPermissions.find(
          (userPermission) => userPermission.code === permission,
        ),
      )
    ) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
