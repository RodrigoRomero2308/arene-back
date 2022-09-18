import { CreateAddressInput } from '@/address/dto/createAddressInput';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

@InputType()
export class CreateOnlyUserInput {
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
  @Field({ nullable: true })
  @IsNotEmpty()
  gender?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  marital_status?: string;
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
}

@InputType()
export class CreateUserInput extends CreateOnlyUserInput {
  @Field(() => CreateAddressInput, { nullable: true })
  address?: CreateAddressInput;
}
