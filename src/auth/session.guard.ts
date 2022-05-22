import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class IsAuthenticatedGuard implements CanActivate {
  constructor(private readonly usersService: UsersService) {
    // Intentional
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = GqlExecutionContext.create(context);
    const req = ctx.getContext().req;

    if (!req.session?.userId) {
      return false;
    }

    const user = await this.usersService.findOne({
      id: req.session.userId,
    });

    if (!user?.active) {
      return false;
    }

    req.user = user;
    req.session.lastUpdated = new Date();

    return true;
  }
}
