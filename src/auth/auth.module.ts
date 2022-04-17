import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { UsersModule } from 'src/users/users.module';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport-jwt.strategy';

/* TODO: Mejorar luego para el uso de refresh tokens, se podria tener un token de refresco hasheado en base de datos con un token de acceso de poco TTL */

@Module({
  providers: [AuthService, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          signOptions: { expiresIn: '60s' /* TODO: hacer configurable */ },
          secret: configService.get('JWT_SECRET'),
        };
      },
    }),
  ],
})
export class AuthModule {}
