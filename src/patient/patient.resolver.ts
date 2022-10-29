import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { PaginationArgs } from '@/common/pagination.args';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { Patient } from '@/prisma-models/patient/patient.model';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePatientInput } from './DTO/createPatientInput';
import { PatientFilter } from './DTO/patient.filter';
import { UpdatePatientInput } from './DTO/updatePatientInput';
import { PatientService } from './patient.service';

@Resolver()
@UseGuards(IsAuthenticatedGuard, PermissionsGuard)
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient])
  @RequiredPermissions(PermissionCodes.PatientRead)
  async getPatients(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: PatientFilter,
  ) {
    return this.patientService.getList({ filter, skip, take });
  }

  @Query(() => Patient, {
    nullable: true,
  })
  @RequiredPermissions(PermissionCodes.PatientRead)
  async getPatientById(
    @Args('id', {
      type: () => Int,
    })
    id: number,
  ) {
    return this.patientService.findById(id);
  }

  @Mutation(() => Patient)
  @RequiredPermissions(PermissionCodes.PatientCreate)
  async createPatient(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreatePatientInput,
    })
    input: CreatePatientInput,
  ) {
    return this.patientService.create(input, user.id);
  }

  @Mutation(() => Patient)
  @RequiredPermissions(PermissionCodes.PatientUpdate)
  async updatePatient(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
    @Args('input', {
      type: () => UpdatePatientInput,
    })
    input: UpdatePatientInput,
  ) {
    return this.patientService.update(id, input, user.id);
  }
}
