import { RoleUser } from '@/prisma-models/role-user/role-user.model';
import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { RoleUserService } from './role-user.service';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { UseGuards } from '@nestjs/common';
import { CreateRoleUserInput } from './dto/create-role-user.input';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/guards/permission.guard';
import { RoleUserUserIdRoleIdCompoundUniqueInput } from '@/prisma-models/role-user/role-user-user-id-role-id-compound-unique.input';

@Resolver()
export class RoleUserResolver {
  constructor(private readonly roleUserService: RoleUserService) {}
  @Mutation(() => RoleUser)
  @RequiredPermissions(PermissionCodes.RoleCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createRoleUser(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateRoleUserInput,
    })
    input: CreateRoleUserInput,
  ) {
    return this.roleUserService.createRoleUser(input, user.id);
  }

  @Mutation(() => RoleUser)
  @RequiredPermissions(PermissionCodes.RoleDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async deleteRoleUser(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', { type: () => RoleUserUserIdRoleIdCompoundUniqueInput })
    input: RoleUserUserIdRoleIdCompoundUniqueInput,
  ) {
    return this.roleUserService.deleteRoleUser(input, user.id);
  }

  @Query(() => [RoleUser])
  @RequiredPermissions(PermissionCodes.RoleCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getRoleUsersByUserId(
    @CurrentUser() user: AuthenticatedUser,
    @Args('userId') userId: number,
  ) {
    return this.roleUserService.getRoleUsersByUserId(userId);
  }
}
