import { RoleUserUncheckedCreateInput } from '@/prisma-models/role-user/role-user-unchecked-create.input';
import { InputType, OmitType } from '@nestjs/graphql';

@InputType()
export class CreateRoleUserInput extends OmitType(
  RoleUserUncheckedCreateInput,
  ['created_by', 'deleted_by', 'dts', 'its'],
) {}
