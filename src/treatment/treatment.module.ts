import { Module } from '@nestjs/common';
import { TreatmentService } from './treatment.service';
import { TreatmentResolver } from './treatment.resolver';
import { UsersService } from '@/users/users.service';
import { HashService } from '@/hash/hash.service';
import { PermissionService } from '@/permission/permission.service';

@Module({
  providers: [TreatmentResolver, TreatmentService, UsersService, HashService, PermissionService]
})
export class TreatmentModule {}
