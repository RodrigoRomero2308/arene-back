import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { HashModule } from 'src/hash/hash.module';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [AuthService, AuthResolver, LocalStrategy],
  imports: [
    UsersModule,
    PassportModule.register({
      session: true,
    }),
    HashModule,
  ],
})
export class AuthModule {}
