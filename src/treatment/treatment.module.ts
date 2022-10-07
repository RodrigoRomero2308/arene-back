import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { TreatmentResolver } from './treatment.resolver';
import { UsersModule } from '@/users/users.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [UsersModule, PermissionModule],
  providers: [TreatmentResolver, TreatmentService],
})
export class TreatmentModule {}
