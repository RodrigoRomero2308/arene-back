import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
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
  ) {
    return true;
  }
}
