import { InputType, OmitType, PartialType } from '@nestjs/graphql';
import { ProfessionalAreaUncheckedCreateInput } from '@/prisma-models/professional-area/professional-area-unchecked-create.input';

@InputType()
export class UpdateAreaProfessionalInput extends OmitType(
  PartialType(ProfessionalAreaUncheckedCreateInput),
  ['created_by', 'its'],
) {}
