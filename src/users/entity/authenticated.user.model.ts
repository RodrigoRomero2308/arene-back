import { Field, ObjectType } from '@nestjs/graphql';
import { Permission } from 'src/permission/entity/permission.entity';
import { User } from './user.entity';

@ObjectType()
export class AuthenticatedUser extends User {
  @Field(() => [Permission])
  permissions: Permission[];
}
