import { UseGuards } from '@nestjs/common';
import { Args, Query, Mutation, Resolver } from '@nestjs/graphql';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { CurrentUser } from '@/decorators/user.decorator';
import { RegisterUserDTO } from './DTO/register.dto';
import { AuthenticatedUser } from './entity/authenticated.user.model';
import { UsersService } from './users.service';
import { PermissionsGuard } from '@/guards/permission.guard';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { User } from '@/prisma-models/user/user.model';

@Resolver()
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Mutation(() => Boolean)
  async register(
    @Args('input', { type: () => RegisterUserDTO }) input: RegisterUserDTO,
  ) {
    await this.usersService.registerUser(input);
    return true;
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
}
