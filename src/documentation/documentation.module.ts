import { Module } from '@nestjs/common';
import { DocumentationService } from './documentation.service';
import { DocumentationResolver } from './documentation.resolver';
import { FileManagementModule } from '@/file-management/file-management.module';
import { UsersModule } from '@/users/users.module';
import { PermissionModule } from '@/permission/permission.module';

@Module({
  providers: [DocumentationService, DocumentationResolver],
  imports: [FileManagementModule, UsersModule, PermissionModule],
})
export class DocumentationModule {}
