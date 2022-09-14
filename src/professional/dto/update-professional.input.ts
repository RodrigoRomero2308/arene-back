import {
  CreateProfessionalInput,
  CreateProfessionalWithoutUserInput,
} from './create-professional.input';
import { InputType, Field, PartialType, OmitType } from '@nestjs/graphql';

@InputType()
export class UpdateProfessionalWithoutUserInput extends PartialType(
  CreateProfessionalWithoutUserInput,
) {}

@InputType()
export class UpdateProfessionalInput extends PartialType(
  OmitType(CreateProfessionalInput, ['professional']),
) {
  @Field(() => UpdateProfessionalWithoutUserInput, { nullable: true })
  professional: UpdateProfessionalWithoutUserInput;
}
