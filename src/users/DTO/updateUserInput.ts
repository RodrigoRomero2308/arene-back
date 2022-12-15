import { Field, InputType, PartialType } from '@nestjs/graphql';
import { CreateOnlyUserInput } from '@/users/DTO/createUserInput';
import { UpdateAddressInput } from '@/address/dto/updateAddressInput';

@InputType()
export class UpdateUserInput extends PartialType(CreateOnlyUserInput) {
  @Field({ nullable: true })
  active?: boolean;
  @Field(() => UpdateAddressInput, { nullable: true })
  address: UpdateAddressInput;
}
