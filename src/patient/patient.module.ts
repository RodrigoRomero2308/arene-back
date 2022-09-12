import { Module } from '@nestjs/common';
import { PatientService } from './patient.service';
import { PatientResolver } from './patient.resolver';
import { UsersModule } from '@/users/users.module';
import { HashModule } from '@/hash/hash.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [UsersModule, HashModule, PermissionModule],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}
