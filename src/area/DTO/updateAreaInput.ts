import { InputType, PartialType } from '@nestjs/graphql';
import { CreateAreaInput } from './createAreaInput';

@InputType()
export class UpdateAreaInput extends PartialType(CreateAreaInput) {}
