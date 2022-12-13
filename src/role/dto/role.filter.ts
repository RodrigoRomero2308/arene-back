import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RoleFilter {
  @Field({ nullable: true })
  isProfessionalRole?: boolean;
}
