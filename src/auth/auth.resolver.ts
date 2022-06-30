import { User } from '@/prisma-models/user/user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { LocalAuthGuard } from './local.auth.guard';

@Resolver()
export class AuthResolver {
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
}
