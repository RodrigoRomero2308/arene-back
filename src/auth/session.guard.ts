import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionService } from '@/permission/permission.service';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UsersService } from '@/users/users.service';
import { User } from '@/prisma-models/user/user.model';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(
    private readonly usersService: UsersService,
    private readonly permissionService: PermissionService,
  ) {
    // Intentional
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (!req.session?.userId) {
      return false;
    }

    const user: User | null = await this.usersService.findOne({
      id: req.session.userId,
    });

    const userPermissions = await this.permissionService.getPermissionsForUser(
      req.session.userId,
    );

    if (!user?.active) {
      return false;
    }

    const authenticatedUser: AuthenticatedUser = {
      ...user,
      permissions: userPermissions,
    };

    req.user = authenticatedUser;
    req.session.lastUpdated = new Date();

    return true;
  }
}
