import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { REQUIRED_PERMISSIONS_KEY } from '@/decorators/permission.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);
  constructor(private reflector: Reflector) {
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

    const authenticatedUser: AuthenticatedUser | undefined = request?.user;

    if (!authenticatedUser) {
      this.logger.warn('Not authenticated user', 'Permission Guard');
      throw new UnauthorizedException();
    }

    const userPermissions = authenticatedUser.permissions;

    if (
      permissionsRequired.every((permission) =>
        userPermissions.find(
          (userPermission) => userPermission.code === permission,
        ),
      )
    ) {
      return true;
    }
    this.logger.warn(
      `Unauthorized user, permissions required: ${permissionsRequired.join(
        ', ',
      )}. userId: ${authenticatedUser.id}`,
    );
    this.logger.debug(
      `Permissions: ${userPermissions.map((item) => item.code).join(', ')}`,
    );
    throw new UnauthorizedException();
  }
}
