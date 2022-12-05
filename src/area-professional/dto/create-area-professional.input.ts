import { InputType, OmitType } from '@nestjs/graphql';
import { ProfessionalAreaUncheckedCreateInput } from '@/prisma-models/professional-area/professional-area-unchecked-create.input';

@InputType()
export class CreateAreaProfessionalInput extends OmitType(
  ProfessionalAreaUncheckedCreateInput,
  ['created_by', 'its'],
) {}
