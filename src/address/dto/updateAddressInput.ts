import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAddressInput } from './createAddressInput';

@InputType()
export class UpdateAddressInput extends PartialType(CreateAddressInput) {}
