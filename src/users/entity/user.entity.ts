// Maps user model for Prisma

import { Field, Int, ObjectType } from '@nestjs/graphql';

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

  @Field(() => Int, {
    nullable: true,
  })
  created_by?: number | null;

  @Field(() => Int, {
    nullable: true,
  })
  updated_by?: number | null;
}
