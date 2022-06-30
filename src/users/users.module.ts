import { Module } from '@nestjs/common';
import { HashModule } from '@/hash/hash.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  imports: [HashModule, PermissionModule],
})
export class UsersModule {}
