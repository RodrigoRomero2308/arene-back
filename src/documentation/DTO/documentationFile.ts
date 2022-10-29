import { Documentation } from '@/prisma-models/documentation/documentation.model';
import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DocumentationFile extends Documentation {
  @Field({ description: 'base64 file' })
  file: string;
}
