import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { PermissionService } from 'src/permission/permission.service';
import { AuthenticatedUser } from 'src/users/entity/authenticated.user.model';
import { User } from 'src/users/entity/user.entity';
import { UsersService } from 'src/users/users.service';

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
