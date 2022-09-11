import { Module } from '@nestjs/common';
import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { AuthModule } from '@/auth/auth.module';
import { UsersModule } from '@/users/users.module';
import { PrismaModule } from '@/prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashModule } from '@/hash/hash.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScalarsModule } from '@/graphql/scalars/scalar.module';
import { getCorsConfig } from '@/utils/cors.utils';
import { PermissionModule } from '@/permission/permission.module';
import { AreaModule } from '@/area/area.module';
import { RoleModule } from './role/role.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    PrismaModule,
    ScalarsModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const corsConfig = getCorsConfig(configService);
        return {
          autoSchemaFile: true,
          cors: corsConfig,
          persistedQueries: false,
          context: ({ req, res }) => ({ req, res }),
          playground: {
            settings: {
              'request.credentials': 'include', // Permite que la sesion se guarde como cookie cuando se usa el playground
            },
          },
          buildSchemaOptions: {
            numberScalarMode: 'integer',
          },
        };
      },
    }),
    HashModule,
    PermissionModule,
    AreaModule,
    RoleModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
