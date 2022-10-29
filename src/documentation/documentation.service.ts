import { FileManagementService } from '@/file-management/file-management.service';
import { PrismaService } from '@/prisma/prisma.service';
import { AuthenticatedUser } from '@/users/entity/authenticated.user.model';
import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CreateDocumentationInput } from './DTO/createDocumentationInput';
import { DocumentationFilterInput } from './DTO/documentation.filter';
import { DocumentationOrderByInput } from './DTO/documentation.orderBy';
import { DocumentationFile } from './DTO/documentationFile';

@Injectable()
export class DocumentationService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileManagementService: FileManagementService,
  ) {}

  async save(input: CreateDocumentationInput, user: AuthenticatedUser) {
    const {
      file,
      patient_id,
      documentation_type_id,
      other_documentation_type,
    } = input;

    if (
      (!documentation_type_id && !other_documentation_type) ||
      (documentation_type_id && other_documentation_type)
    ) {
      throw new Error('Invalid parameters for documentation type');
    }

    const { createReadStream, filename, mimetype } = await file.promise;

    const fileId = await this.fileManagementService.uploadToDrive({
      fileInput: createReadStream(),
      googleDriveFilePath: `patient/${patient_id}`,
      mimetype,
    });

    return this.prismaService.documentation.create({
      data: {
        filename,
        mimetype,
        created_by: user.id,
        patient_id,
        external_id: fileId,
      },
    });
  }

  async getById(id: number): Promise<DocumentationFile> {
    const documentation = await this.prismaService.documentation.findFirst({
      where: {
        id,
        dts: null,
      },
    });

    if (!documentation) {
      throw new Error('Documentation not found');
    }

    const fileData =
      await this.fileManagementService.downloadFileFromDriveByFileId(
        documentation.external_id,
      );

    return {
      ...documentation,
      file: fileData,
    };
  }

  private getPrismaParameters({
    filter,
    orderBy,
    skip,
    take,
  }: {
    filter?: DocumentationFilterInput;
    orderBy?: DocumentationOrderByInput;
    skip?: number;
    take?: number;
  }) {
    const whereInput: Prisma.DocumentationWhereInput = {};

    if (filter) {
      const { documentation_type, filename, patient_id } = filter;

      const filters: Prisma.DocumentationWhereInput[] = [
        {
          dts: null,
        },
      ];

      if (documentation_type) {
        filters.push({
          OR: [
            {
              documentationType: {
                name: {
                  contains: documentation_type,
                },
              },
            },
            {
              other_documentation_type: {
                contains: documentation_type,
              },
            },
          ],
        });
      }

      if (filename) {
        filters.push({
          filename: {
            contains: filename,
          },
        });
      }

      if (patient_id && patient_id.length) {
        filters.push({
          patient_id: {
            in: patient_id,
          },
        });
      }

      whereInput.AND = filters;
    }

    const orderByInput: Prisma.DocumentationOrderByWithRelationInput = {};

    if (orderBy) {
      orderByInput[orderBy.field] = orderBy.direction;
    }

    return {
      where: whereInput,
      orderBy: orderByInput,
      skip,
      take,
    };
  }

  getList({
    filter,
    orderBy,
    skip,
    take,
  }: {
    filter?: DocumentationFilterInput;
    orderBy?: DocumentationOrderByInput;
    skip?: number;
    take?: number;
  }) {
    const prismaParams = this.getPrismaParameters({
      filter,
      orderBy,
      skip,
      take,
    });
    return this.prismaService.documentation.findMany({
      ...prismaParams,
    });
  }

  getCount({
    filter,
    orderBy,
  }: {
    filter?: DocumentationFilterInput;
    orderBy?: DocumentationOrderByInput;
  }) {
    const prismaParams = this.getPrismaParameters({
      filter,
      orderBy,
    });
    return this.prismaService.documentation.count({
      ...prismaParams,
    });
  }
}
