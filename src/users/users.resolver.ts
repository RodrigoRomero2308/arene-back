import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver, Int } from '@nestjs/graphql';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from './entity/authenticated.user.model';
import { UsersService } from './users.service';
import { PermissionsGuard } from '@/guards/permission.guard';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { User } from '@/prisma-models/user/user.model';
import { CreateUserInput } from './DTO/createUserInput';
import { UpdateUserInput } from './DTO/updateUserInput';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Boolean)
  async register(
    @Args('input', { type: () => CreateUserInput }) input: CreateUserInput,
  ) {
    await this.usersService.registerUser(input);
    return true;
  }

  @Query(() => User)
  @RequiredPermissions(PermissionCodes.UsersRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getUserById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.usersService.findById(id);
  }

  @Query(() => AuthenticatedUser)
  @UseGuards(IsAuthenticatedGuard)
  async authenticate(@CurrentUser() user: AuthenticatedUser) {
    return user;
  }

  @Query(() => [User])
  @RequiredPermissions(PermissionCodes.UsersRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getUsers() {
    return this.usersService.findMany();
  }

  @Mutation(() => User)
  @RequiredPermissions(PermissionCodes.UsersRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async updateUser(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdateUserInput,
    })
    input: UpdateUserInput,
  ) {
    return this.usersService.update(id, input, user.id);
  }
}
