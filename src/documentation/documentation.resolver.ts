import { IsAuthenticatedGuard } from '@/auth/session.guard';
import { PaginationArgs } from '@/common/pagination.args';
import { RequiredPermissions } from '@/decorators/permission.decorator';
import { CurrentUser } from '@/decorators/user.decorator';
import { PermissionCodes } from '@/enums/permissionCodes.enum';
import { PermissionsGuard } from '@/guards/permission.guard';
import { Documentation } from '@/prisma-models/documentation/documentation.model';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { DocumentationService } from './documentation.service';
import { CreateDocumentationInput } from './DTO/createDocumentationInput';
import { DocumentationFilterInput } from './DTO/documentation.filter';
import { DocumentationOrderByInput } from './DTO/documentation.orderBy';
import { DocumentationFile } from './DTO/documentationFile';

@Resolver()
@UseGuards(IsAuthenticatedGuard, PermissionsGuard)
export class DocumentationResolver {
  constructor(private readonly documentationService: DocumentationService) {}

  @Query(() => [Documentation])
  @RequiredPermissions(PermissionCodes.DocumentationRead)
  async getDocumentationList(
    @Args() { skip, take }: PaginationArgs,
    @Args('filter', { nullable: true }) filter?: DocumentationFilterInput,
    @Args('orderBy', { nullable: true }) orderBy?: DocumentationOrderByInput,
  ) {
    return this.documentationService.getList({
      filter,
      orderBy,
      skip,
      take,
    });
  }

  @Query(() => Int)
  @RequiredPermissions(PermissionCodes.DocumentationRead)
  async getDocumentationCount(
    @Args('filter') filter?: DocumentationFilterInput,
    @Args('orderBy') orderBy?: DocumentationOrderByInput,
  ) {
    return this.documentationService.getCount({
      filter,
      orderBy,
    });
  }

  @Query(() => DocumentationFile)
  @RequiredPermissions(PermissionCodes.DocumentationRead)
  async getDocumentation(@Args('id') id: number) {
    return this.documentationService.getById(id);
  }

  @Mutation(() => Documentation)
  @RequiredPermissions(PermissionCodes.DocumentationCreate)
  async saveDocumentation(
    @CurrentUser() user: AuthenticatedUser,
    @Args('input', { type: () => CreateDocumentationInput })
    input: CreateDocumentationInput,
  ) {
    return await this.documentationService.save(input, user);
  }
}
