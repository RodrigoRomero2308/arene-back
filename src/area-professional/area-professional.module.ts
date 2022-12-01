import { Module } from '@nestjs/common';
import { AreaProfessionalService } from './area-professional.service';
import { AreaProfessionalResolver } from './area-professional.resolver';
import { PermissionModule } from '@/permission/permission.module';
import { UsersModule } from '@/users/users.module';

@Module({
  providers: [AreaProfessionalResolver, AreaProfessionalService],
  imports: [UsersModule, PermissionModule],
})
export class AreaProfessionalModule {}
