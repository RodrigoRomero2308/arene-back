import { Field, InputType, OmitType, PartialType } from '@nestjs/graphql';
import {
  CreatePatientInput,
  CreatePatientWithoutUserInput,
} from './createPatientInput';

@InputType()
export class UpdatePatientWithoutUserInput extends PartialType(
  CreatePatientWithoutUserInput,
) {}

@InputType()
export class UpdatePatientInput extends PartialType(
  OmitType(CreatePatientInput, ['patient']),
) {
  @Field(() => UpdatePatientWithoutUserInput, { nullable: true })
  patient: UpdatePatientWithoutUserInput;
}
