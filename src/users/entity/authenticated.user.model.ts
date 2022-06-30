import { Field, ObjectType } from '@nestjs/graphql';
import { Permission } from '@/prisma-models/permission/permission.model';
import { User } from '@/prisma-models/user/user.model';

@ObjectType()
export class AuthenticatedUser extends User {
  @Field(() => [Permission])
  permissions: Permission[];
}
