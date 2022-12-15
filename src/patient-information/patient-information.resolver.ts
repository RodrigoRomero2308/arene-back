import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { PaginationArgs } from '@/common/pagination.args';
import { PermissionsGuard } from '@/guards/permission.guard';
import { PatientInformation } from '@/prisma-models/patient-information/patient-information.model';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Args } from '@nestjs/graphql';
import { PatientInformationFilter } from './DTO/patient-information.filter';
import { PatientInformationOrderByInput } from './DTO/patient-information.orderBy';
import { PatientInformationService } from './patient-information.service';

@Resolver(() => PatientInformation)
@UseGuards(IsAuthenticatedGuard, PermissionsGuard)
export class PatientInformationResolver {
  constructor(
    private readonly patientInformationService: PatientInformationService,
  ) {}

  @Query(() => [PatientInformation], { name: 'patientInformation' })
  findAll(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: PatientInformationFilter,
    @Args('orderBy', { nullable: true })
    orderBy?: PatientInformationOrderByInput,
  ) {
    return this.patientInformationService.findAll({
      filter,
      orderBy,
      skip,
      take,
    });
  }
}
