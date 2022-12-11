import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { PaginationArgs } from '@/common/pagination.args';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { Appointment } from '@/prisma-models/appointment/appointment.model';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UseGuards } from '@nestjs/common';
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppointmentService } from './appointment.service';
import { AppointmentFilter } from './dto/appointment.filter';
import { CreateAppointmentInput } from './dto/create-appointment.input';

@Resolver(() => Appointment)
export class AppointmentResolver {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Query(() => [Appointment])
  @RequiredPermissions(PermissionCodes.AppointmentRead)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  async getAppointments(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: AppointmentFilter,
  ) {
    return this.appointmentService.getList({ filter, skip, take });
  }

  @Mutation(() => Appointment)
  @RequiredPermissions(PermissionCodes.AppointmentCreate)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  createAppointment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', {
      type: () => CreateAppointmentInput,
    })
    input: CreateAppointmentInput,
  ) {
    return this.appointmentService.create(input, user);
  }

  @Mutation(() => Appointment)
  @RequiredPermissions(PermissionCodes.AppointmentDelete)
  @UseGuards(IsAuthenticatedGuard, PermissionsGuard)
  deleteAppointment(
    @CurrentUser() user: AuthenticatedUser,
    @Args('id', { type: () => Int }) id: number,
  ) {
    return this.appointmentService.delete(id, user);
  }
}
