import { RoleUser } from '@/prisma-models/role-user/role-user.model';
import { Args, Int, Mutation, Resolver } from '@nestjs/graphql';
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
  constructor(private readonly roleService: RoleUserService) {}
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
    return this.roleService.createRoleUser(input, user.id);
  }

  @Mutation(() => RoleUser)
  @RequiredPermissions(PermissionCodes.RoleDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async deleteRoleUser(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', { type: () => RoleUserUserIdRoleIdCompoundUniqueInput })
    input: RoleUserUserIdRoleIdCompoundUniqueInput,
  ) {
    return this.roleService.deleteRoleUser(input, user.id);
  }
}
