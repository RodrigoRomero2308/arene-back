import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { IsAuthenticatedGuard } from 'src/auth/session.guard';
import { RegisterUserDTO } from './DTO/register.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Query(() => [User])
  @UseGuards(IsAuthenticatedGuard)
  async getUsers() {
    return this.usersService.findMany();
  }

  @Mutation(() => Boolean)
  async register(
    @Args('input', { type: () => RegisterUserDTO }) input: RegisterUserDTO,
  ) {
    await this.usersService.registerUser(input);
    return true;
  }
}
