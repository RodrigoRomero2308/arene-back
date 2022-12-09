import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { PatientStatus } from '@/prisma-models/patient-status/patient-status.model';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args, Int } from '@nestjs/graphql';
import { PatientStatusService } from './patient-status.service';

@Resolver()
@UseGuards(IsAuthenticatedGuard, PermissionsGuard)
export class PatientStatusResolver {
  constructor(private readonly patientStatusService: PatientStatusService) {}

  @Query(() => [PatientStatus])
  @RequiredPermissions(PermissionCodes.PatientStatusRead)
  async getAllPatientStatus() {
    return this.patientStatusService.getList();
  }

  @Query(() => PatientStatus)
  @RequiredPermissions(PermissionCodes.PatientStatusRead)
  async getStatusById(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.patientStatusService.getStatusById(id);
  }
}
