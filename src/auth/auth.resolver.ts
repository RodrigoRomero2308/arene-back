import { UseGuards } from '@nestjs/common';
import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { User } from 'src/users/entity/user.entity';
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
    return true;
  }
}
