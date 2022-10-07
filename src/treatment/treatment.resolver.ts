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

@Resolver(() => Treatment)
export class TreatmentResolver {
  constructor(private readonly treatmentService: TreatmentService) {}

  @Query(() => [Treatment])
  @UseGuards(IsAuthenticatedGuard)
  async getTreatments() {
    return this.treatmentService.getList();
  }

  @Query(() => Treatment, {
    nullable: true,
  })
  @UseGuards(IsAuthenticatedGuard)
  async getTreatmentById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.treatmentService.findById(id);
  }

  @Query(() => [Treatment], {
    nullable: true,
  })
  @UseGuards(IsAuthenticatedGuard)
  async getTreatmentsByUserId(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.treatmentService.findByUserId(id);
  }

  @Query(() => [Treatment], {
    nullable: true,
  })
  @UseGuards(IsAuthenticatedGuard)
  async getTreatmentsByAreaId(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.treatmentService.findByAreaId(id);
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
  updateArea(
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
