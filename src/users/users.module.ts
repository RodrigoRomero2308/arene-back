import { Module } from '@nestjs/common';
import { HashModule } from 'src/hash/hash.module';
import { UsersService } from './users.service';
import { UsersResolver } from './users.resolver';

@Module({
  providers: [UsersService, UsersResolver],
  exports: [UsersService],
  imports: [HashModule],
})
export class UsersModule {}
