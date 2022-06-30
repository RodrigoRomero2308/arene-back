import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { REQUIRED_PERMISSIONS_KEY } from '@/decorators/permission.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';

@Injectable()
export class PermissionsGuard implements CanActivate {
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

    throw new UnauthorizedException();
  }
}
