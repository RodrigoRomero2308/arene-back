import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { ProfessionalArea } from '@/prisma-models/professional-area/professional-area.model';
import { UseGuards } from '@nestjs/common';
import { ProfessionalAreaArea_idProfessional_idCompoundUniqueInput } from '@/prisma-models/professional-area/professional-area-area-id-professional-id-compound-unique.input';
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { AreaProfessionalService } from './area-professional.service';
import { CreateAreaProfessionalInput } from './dto/create-area-professional.input';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';

@Resolver()
export class AreaProfessionalResolver {
  constructor(
    private readonly areaProfessionalService: AreaProfessionalService,
  ) {}
  @Mutation(() => ProfessionalArea)
  @RequiredPermissions(PermissionCodes.RoleCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createAreaProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateAreaProfessionalInput,
    })
    input: CreateAreaProfessionalInput,
  ) {
    return this.areaProfessionalService.createAreaProfessional(input, user.id);
  }

  @Mutation(() => ProfessionalArea)
  @RequiredPermissions(PermissionCodes.RoleDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async deleteAreaProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => ProfessionalAreaArea_idProfessional_idCompoundUniqueInput,
    })
    input: ProfessionalAreaArea_idProfessional_idCompoundUniqueInput,
  ) {
    this.areaProfessionalService.deleteAreaProfessional(input);
    return input;
  }

  @Query(() => [ProfessionalArea])
  @RequiredPermissions(PermissionCodes.RoleCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getAreaProfessionalsByProfessionalId(
    @CurrentUser() user: AuthenticatedUser,
    @Args('userId') userId: number,
  ) {
    return this.areaProfessionalService.getRoleUsersByProfessionalId(userId);
  }
}
