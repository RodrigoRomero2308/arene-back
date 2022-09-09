import { AreaCreateInput } from '@/prisma-models/area/area-create.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateAreaInput extends OmitType(AreaCreateInput, [
  'createdBy',
  'deletedBy',
  'updatedBy',
  'ProfessionalArea',
  'Treatment',
  'its',
  'uts',
  'dts',
]) {}
