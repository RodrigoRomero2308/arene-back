import { Module } from '@nestjs/common';
import { AreaResolver } from '@/area/area.resolver';
import { AreaService } from '@/area/area.service';
import { UsersModule } from '@/users/users.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  providers: [AreaResolver, AreaService],
  imports: [UsersModule, PermissionModule],
})
export class AreaModule {}
