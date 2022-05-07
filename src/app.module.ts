import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HashModule } from './hash/hash.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ScalarsModule } from './graphql/scalars/scalar.module';
import { getCorsConfig } from './utils/cors.utils';

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
          context: ({ req, res }) => ({ req, res }),
          playground: {
            settings: {
              'request.credentials': 'include',
            },
          },
        };
      },
    }),
    HashModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
