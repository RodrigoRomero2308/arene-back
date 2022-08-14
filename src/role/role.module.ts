import { Module } from '@nestjs/common';
import { RoleService } from './role.service';
import { RoleResolver } from './role.resolver';
import { PermissionModule } from '@/permission/permission.module';
import { UsersModule } from '@/users/users.module';

@Module({
  providers: [RoleResolver, RoleService],
  imports: [UsersModule, PermissionModule],
})
export class RoleModule {}
