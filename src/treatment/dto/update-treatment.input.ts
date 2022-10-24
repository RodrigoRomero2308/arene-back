import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { TreatmentUncheckedCreateInput } from '@/prisma-models/treatment/treatment-unchecked-create.input';

@InputType()
export class UpdateTreatmentInput extends OmitType(
  PartialType(TreatmentUncheckedCreateInput),
  ['area_id', 'patient_id', "Appointment"],
) {}
