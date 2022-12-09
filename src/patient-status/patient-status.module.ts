import { Module } from '@nestjs/common';
import { PatientStatusService } from './patient-status.service';
import { PatientStatusResolver } from './patient-status.resolver';
import { PermissionModule } from '@/permission/permission.module';
import { UsersModule } from '@/users/users.module';

@Module({
  providers: [PatientStatusResolver, PatientStatusService],
  imports: [UsersModule, PermissionModule],
})
export class PatientStatusModule {}
