import { CreateTreatmentInput } from './create-treatment.input';
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateTreatmentInput extends PartialType(CreateTreatmentInput) {}
