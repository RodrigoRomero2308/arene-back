import { Role } from '@/prisma-models/role/role.model';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { RoleService } from './role.service';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateRoleInput } from './dto/update-role.input';
import { CreateRoleInput } from './dto/create-role.input';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/guards/permission.guard';

@Resolver()
export class RoleResolver {
  constructor(private readonly roleService: RoleService) {}

  @Query(() => [Role])
  @UseGuards(IsAuthenticatedGuard)
  async getRoles() {
    return this.roleService.getRoles();
  }

  @Query(() => Role, {
    nullable: true,
  })
  @UseGuards(IsAuthenticatedGuard)
  async getRoleById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.roleService.getRoleById(id);
  }

  @Mutation(() => Role)
  @RequiredPermissions(PermissionCodes.RoleCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateRoleInput,
    })
    input: CreateRoleInput,
  ) {
    return this.roleService.createRole(input, user.id);
  }

  @Mutation(() => Role)
  @RequiredPermissions(PermissionCodes.RoleUpdate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async updateRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdateRoleInput,
    })
    input: UpdateRoleInput,
  ) {
    return this.roleService.updateRole(id, input, user.id);
  }

  @Mutation(() => Role)
  @RequiredPermissions(PermissionCodes.RoleDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async deleteRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.roleService.deleteRole(id, user.id);
  }

  @Mutation(() => Role)
  @RequiredPermissions(PermissionCodes.RoleAlta)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async altaRole(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.roleService.altaRole(id);
  }
}
