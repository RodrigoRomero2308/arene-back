import { EnvironmentVariable } from '@/enums/env.enum';
import { User } from '@/prisma-models/user/user.model';
import { UseGuards } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Session } from 'express-session';
import { ServerResponse } from 'http';
import { LocalAuthGuard } from './local.auth.guard';
import { IsAuthenticatedGuard } from './session.guard';

@Resolver()
export class AuthResolver {
  constructor(private readonly configService: ConfigService) {}

  @Mutation(() => Boolean)
  @UseGuards(LocalAuthGuard)
  async login(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('dniOrEmail') _dniOrEmail: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    @Args('password') _password: string,
    @Context() context: { req: any; res: any; user: User },
  ) {
    context.req.session.userId = context.user.id;
    context.req.session.lastUpdated = new Date();
    return true;
  }

  @Mutation(() => Boolean)
  @UseGuards(IsAuthenticatedGuard)
  async logout(
    @Context() context: { req: any; res: ServerResponse; user: User },
  ) {
    let error: any;
    if (context.req.session instanceof Session) {
      const session: Session = context.req.session;
      session.destroy((err) => {
        if (err) {
          error = err;
        }
      });
    }
    const sessionName =
      this.configService.get(EnvironmentVariable.SESSION_NAME) || 'sessId';
    context.res.setHeader(
      'Set-Cookie',
      `${sessionName}=deleted; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`,
    );
    return !error;
  }
}
