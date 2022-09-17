import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ProfessionalService } from './professional.service';
import { CreateProfessionalInput } from './dto/create-professional.input';
import { UpdateProfessionalInput } from './dto/update-professional.input';
import { Professional } from '@/prisma-models/professional/professional.model';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { PermissionsGuard } from '@/guards/permission.guard';
import { UseGuards } from '@nestjs/common';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';

@Resolver()
export class ProfessionalResolver {
  constructor(private readonly professionalService: ProfessionalService) {}

  @Query(() => [Professional])
  @RequiredPermissions(PermissionCodes.ProfessionalRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getProfessionals() {
    return this.professionalService.getList();
  }

  @Query(() => Professional, {
    nullable: true,
  })
  @RequiredPermissions(PermissionCodes.ProfessionalRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getProfessionalById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.professionalService.findById(id);
  }

  @Mutation(() => Professional)
  @RequiredPermissions(PermissionCodes.ProfessionalCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async createProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateProfessionalInput,
    })
    input: CreateProfessionalInput,
  ) {
    return this.professionalService.create(input, user.id);
  }

  @Mutation(() => Professional)
  @RequiredPermissions(PermissionCodes.ProfessionalUpdate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async updateProfessional(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdateProfessionalInput,
    })
    input: UpdateProfessionalInput,
  ) {
    return this.professionalService.update(id, input, user.id);
  }
}
