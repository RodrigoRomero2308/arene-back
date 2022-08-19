import { RoleUserUncheckedCreateInput } from '@/prisma-models/role-user/role-user-unchecked-create.input';
import { InputType, OmitType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateRoleInput extends OmitType(
  PartialType(RoleUserUncheckedCreateInput),
  ['created_by', 'deleted_by', 'dts', 'its'],
) {}
