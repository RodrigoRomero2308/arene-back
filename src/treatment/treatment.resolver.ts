import { Treatment } from '@/prisma-models/treatment/treatment.model';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { TreatmentService } from '@/treatment/treatment.service';
import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { UseGuards } from '@nestjs/common';
import { CreateTreatmentInput } from './dto/create-treatment.input';
import { UpdateTreatmentInput } from './dto/update-treatment.input';
import { CurrentUser } from '@/decorators/user.decorator';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { PermissionsGuard } from '@/guards/permission.guard';
import { PaginationArgs } from '@/common/pagination.args';
import { TreatmentFilter } from './dto/treatment.filter';

@Resolver(() => Treatment)
export class TreatmentResolver {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Query(() => [Treatment])
  @RequiredPermissions(PermissionCodes.TreatmentRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getTreatments(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: TreatmentFilter,
  ) {
    return this.treatmentService.getList({ filter, skip, take });
  }

  @Mutation(() => Treatment)
  @RequiredPermissions(PermissionCodes.TreatmentCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  createTreatment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateTreatmentInput,
    })
    input: CreateTreatmentInput,
  ) {
    return this.treatmentService.create(input);
  }

  @Mutation(() => Treatment)
  @RequiredPermissions(PermissionCodes.TreatmentUpdate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  updateTreatment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdateTreatmentInput,
    })
    input: UpdateTreatmentInput,
  ) {
    return this.treatmentService.update(id, input);
  }

  @Mutation(() => Treatment)
  @RequiredPermissions(PermissionCodes.TreatmentDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  deleteTreatment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.treatmentService.delete(id);
  }
}
