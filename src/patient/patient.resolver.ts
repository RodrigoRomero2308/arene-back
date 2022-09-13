import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { Patient } from '@/prisma-models/patient/patient.model';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreatePatientInput } from './DTO/createPatientInput';
import { UpdatePatientInput } from './DTO/updatePatientInput';
import { PatientService } from './patient.service';

@Resolver()
export class PatientResolver {
  constructor(private readonly patientService: PatientService) {}

  @Query(() => [Patient])
  @RequiredPermissions(PermissionCodes.PatientRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getPatients() {
    return this.patientService.getList();
  }

  @Query(() => Patient, {
    nullable: true,
  })
  @RequiredPermissions(PermissionCodes.PatientRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
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
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
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
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
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
