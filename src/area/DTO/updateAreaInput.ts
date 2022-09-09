import { AreaCreateInput } from '@/prisma-models/area/area-create.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateAreaInput extends OmitType(PartialType(AreaCreateInput), [
  'createdBy',
  'deletedBy',
  'updatedBy',
  'ProfessionalArea',
  'Treatment',
  'its',
  'uts',
  'dts',
]) {}
