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
import { PaginationArgs } from '@/common/pagination.args';
import { UserFilter } from './DTO/user.filter';
import { ProfessionalFilter } from '@/professional/dto/professional.filter';
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

  @Query(() => User, {
    nullable: true,
  })
  @Mutation(() => User)
  @RequiredPermissions(PermissionCodes.ProfessionalCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createAdministrator(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateUserInput,
    })
    input: CreateUserInput,
  ) {
    return this.usersService.registerAdministrator(input, user.id);
  }

  @Mutation(() => User)
  @RequiredPermissions(PermissionCodes.ProfessionalCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createDirector(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateUserInput,
    })
    input: CreateUserInput,
  ) {
    return this.usersService.registerDirector(input, user.id);
  }

  @Mutation(() => User)
  @RequiredPermissions(PermissionCodes.ProfessionalCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createCoordinator(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateUserInput,
    })
    input: CreateUserInput,
  ) {
    return this.usersService.registerCoordinator(input, user.id);
  }

  @RequiredPermissions(PermissionCodes.ProfessionalRead)
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
  @RequiredPermissions(PermissionCodes.ProfessionalUpdate)
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

  @Query(() => [User])
  @RequiredPermissions(PermissionCodes.ProfessionalRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getAdministrators(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: UserFilter,
  ) {
    return this.usersService.getListByRole('Administrador', {
      filter,
      skip,
      take,
    });
  }

  @Query(() => [User])
  @RequiredPermissions(PermissionCodes.ProfessionalRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getCoordinators(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: UserFilter,
  ) {
    return this.usersService.getListByRole('Coordinador', {
      filter,
      skip,
      take,
    });
  }

  @Query(() => [User])
  @RequiredPermissions(PermissionCodes.ProfessionalRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getDirectors(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: UserFilter,
  ) {
    return this.usersService.getListByRole('Director', {
      filter,
      skip,
      take,
    });
  }

  // @Query(() => [User])
  // @RequiredPermissions(PermissionCodes.ProfessionalRead)
  // @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  // async getPhysiatrists(
  //   @Args() { skip, take }: PaginationArgs,
  //   @Args('filter', { nullable: true }) filter?: ProfessionalFilter,
  // ) {
  //   return this.usersService.getListByRole('Fisiatra', {
  //     filter,
  //     skip,
  //     take,
  //   });
  // }
}
