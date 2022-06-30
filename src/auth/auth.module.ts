import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from '@/users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HashModule } from '@/hash/hash.module';
import { LocalStrategy } from './local.strategy';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy],
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    HashModule,
    PermissionModule,
  ],
})
export class AuthModule {}
