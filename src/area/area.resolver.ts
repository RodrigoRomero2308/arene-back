import { Area } from '@/prisma-models/area/area.model';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AreaService } from '@/area/area.service';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { UseGuards } from '@nestjs/common';
import { UpdateAreaInput } from '@/area/DTO/updateAreaInput';
import { CreateAreaInput } from '@/area/DTO/createAreaInput';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/guards/permission.guard';

@Resolver()
export class AreaResolver {
  constructor(private readonly areaService: AreaService) {}

  @Query(() => [Area])
  @UseGuards(IsAuthenticatedGuard)
  async getAreas() {
    return this.areaService.getList();
  }

  @Query(() => Area, {
    nullable: true,
  })
  @UseGuards(IsAuthenticatedGuard)
  async getAreaById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.areaService.findById(id);
  }

  @Mutation(() => Area)
  @RequiredPermissions(PermissionCodes.AreaCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createArea(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateAreaInput,
    })
    input: CreateAreaInput,
  ) {
    return this.areaService.create(input, user.id);
  }

  @Mutation(() => Area)
  @RequiredPermissions(PermissionCodes.AreaUpdate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async updateArea(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdateAreaInput,
    })
    input: UpdateAreaInput,
  ) {
    return this.areaService.update(id, input, user.id);
  }

  @Mutation(() => Area)
  @RequiredPermissions(PermissionCodes.AreaDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async deleteArea(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.areaService.delete(id, user.id);
  }

  @Query(() => Area)
  @RequiredPermissions(PermissionCodes.AdminArea)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getAreaByAreaName(
    @CurrentUser() user: AuthenticatedUser,
    @Args('areaName', { type: () => String }) areaName: string,
  ) {
    return this.areaService.getAreaByAreaName(areaName);
  }
}
