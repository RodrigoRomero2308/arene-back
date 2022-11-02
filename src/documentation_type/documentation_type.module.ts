import { Module } from '@nestjs/common';
import { DocumentationTypeResolver } from './documentation_type.resolver';
import { DocumentationTypeService } from './documentation_type.service';

@Module({
  providers: [DocumentationTypeResolver, DocumentationTypeService]
})
export class DocumentationTypeModule {}
