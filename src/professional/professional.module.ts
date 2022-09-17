import { Module } from '@nestjs/common';
import { ProfessionalService } from './professional.service';
import { ProfessionalResolver } from './professional.resolver';
import { UsersModule } from '@/users/users.module';
import { HashModule } from '@/hash/hash.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  imports: [UsersModule, HashModule, PermissionModule],
  providers: [ProfessionalResolver, ProfessionalService],
})
export class ProfessionalModule {}
