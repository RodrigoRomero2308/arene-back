import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty()
  @IsNumberString()
  dni: string;
  @Field()
  @IsNotEmpty()
  @IsEmail()
  email: string;
  @Field()
  @IsNotEmpty()
  firstname: string;
  @Field()
  @IsNotEmpty()
  lastname: string;
  @Field()
  @IsNotEmpty()
  password: string;
  @Field(() => Date)
  birth_date: Date;
  @Field({ nullable: true })
  phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty()
  phone_number?: string;
  @Field({ nullable: true })
  adress_id?: number;
}
