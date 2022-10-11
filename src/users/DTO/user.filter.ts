import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class UserFilter {
  @Field({ nullable: true })
  dni?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;
}
