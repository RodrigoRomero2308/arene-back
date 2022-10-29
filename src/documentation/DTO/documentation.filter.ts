import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class DocumentationFilterInput {
  @Field({ nullable: true })
  filename?: string;

  @Field(() => [Int], { nullable: true })
  patient_id?: number[];

  @Field({ nullable: true })
  documentation_type?: string;
}
