import { Module } from '@nestjs/common';
import { RoleUserService } from './role-user.service';
import { RoleUserResolver } from './role-user.resolver';
import { PermissionModule } from '@/permission/permission.module';
import { UsersModule } from '@/users/users.module';

@Module({
  providers: [RoleUserResolver, RoleUserService],
  imports: [UsersModule, PermissionModule],
})
export class RoleUserModule {}
