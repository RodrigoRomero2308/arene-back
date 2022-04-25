// Maps user model for Prisma

import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class User {
  @Field()
  id: number;

  @Field()
  dni: string;

  @Field()
  email: string;

  @Field()
  firstname: string;

  @Field()
  lastname: string;

  password: string;

  @Field()
  phone: string;

  @Field()
  active: boolean;

  @Field()
  its: Date;

  @Field()
  created_by: number;

  @Field()
  updated_by: number;
}
