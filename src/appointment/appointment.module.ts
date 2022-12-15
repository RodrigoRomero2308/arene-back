import { Module } from '@nestjs/common';
import { AppointmentService } from './appointment.service';
import { AppointmentResolver } from './appointment.resolver';
import { PermissionModule } from '@/permission/permission.module';
import { UsersModule } from '@/users/users.module';

@Module({
  imports: [UsersModule, PermissionModule],
  providers: [AppointmentResolver, AppointmentService]
})
export class AppointmentModule {}
