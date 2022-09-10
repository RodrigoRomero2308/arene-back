import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from '@/users/DTO/createUserInput';

@InputType()
export class UpdateUserInput extends PartialType(CreateUserInput) {
  @Field({ nullable: true })
  active?: boolean;
}
