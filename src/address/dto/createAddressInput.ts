import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAddressInput {
  @Field()
  @IsNotEmpty()
  street: string;
  @Field()
  @IsNotEmpty()
  height: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  flat_number?: string;
  @Field()
  @IsNotEmpty()
  province: string;
  @Field()
  @IsNotEmpty()
  city: string;
  @Field()
  @IsNotEmpty()
  department: string;
}
