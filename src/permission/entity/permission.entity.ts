import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class Permission {
  @Field(() => String)
  code: string;

  @Field(() => String)
  shortname: string;

  @Field(() => String, { nullable: true })
  description?: string | null;
}
