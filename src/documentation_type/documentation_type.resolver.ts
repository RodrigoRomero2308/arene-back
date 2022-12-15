import { DocumentationType } from '@/prisma-models/documentation-type/documentation-type.model';
import { Query, Resolver } from '@nestjs/graphql';
import { DocumentationTypeService } from './documentation_type.service';

@Resolver()
export class DocumentationTypeResolver {
  constructor(
    private readonly documentationTypeService: DocumentationTypeService,
  ) {}

  @Query(() => [DocumentationType])
  async getDocumentationTypes() {
    return this.documentationTypeService.getList();
  }
}
