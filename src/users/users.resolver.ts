import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { RegisterUserDTO } from './DTO/register.dto';
import { User } from './entity/user.entity';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  // TODO: protect with guard
  @Query(() => [User])
  async users() {
    return this.usersService.findMany();
  }

  @Mutation(() => Boolean)
  async register(
    @Args('input', { type: () => RegisterUserDTO }) input: RegisterUserDTO,
  ) {
    const createdUser = await this.usersService.registerUser(input);
    console.log(createdUser);
    return true;
  }
}
