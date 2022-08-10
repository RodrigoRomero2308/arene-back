import { RoleUncheckedCreateInput } from '@/prisma-models/role/role-unchecked-create.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends OmitType(
  PartialType(RoleUncheckedCreateInput),
  [
    'PermissionRole',
    'created_by',
    'deleted_by',
    'updated_by',
    'dts',
    'its',
    'uts',
    'isSystemRole',
    'id',
  ],
) {}
