import { Field, InputType } from '@nestjs/graphql';
import { Upload, GraphQLUpload } from 'graphql-upload';

@InputType()
export class CreateDocumentationInput {
  @Field()
  patient_id: number;
  @Field({ nullable: true })
  documentation_type_id?: number;
  @Field({ nullable: true })
  other_documentation_type?: string;
  @Field(() => GraphQLUpload)
  file: Upload;
}
