import { InputType, OmitType } from '@nestjs/graphql';
import { RoleUncheckedCreateInput } from '@/prisma-models/role/role-unchecked-create.input';

@InputType()
export class CreateRoleInput extends OmitType(RoleUncheckedCreateInput, [
  'PermissionRole',
  'created_by',
  'deleted_by',
  'updated_by',
  'its',
  'uts',
  'dts',
  'isSystemRole',
  'RoleUser',
  'id',
]) {}
