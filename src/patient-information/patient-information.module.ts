import { Module } from '@nestjs/common';
import { PatientInformationService } from './patient-information.service';
import { PatientInformationResolver } from './patient-information.resolver';
import { UsersModule } from '@/users/users.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  exports: [PatientInformationService],
  providers: [PatientInformationResolver, PatientInformationService],
  imports: [UsersModule, PermissionModule],
})
export class PatientInformationModule {}
