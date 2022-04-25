import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver, Context } from '@nestjs/graphql';
import { LocalAuthGuard } from './local.auth.guard';

@Resolver()
export class AuthResolver {
  @Mutation(() => Boolean)
  @UseGuards(LocalAuthGuard)
  async login(
    @Args('dniOrEmail') dniOrEmail: string,
    @Args('password') password: string,
    @Context() ctx: any,
  ) {
    console.log(ctx.user);
    return true;
  }
}
