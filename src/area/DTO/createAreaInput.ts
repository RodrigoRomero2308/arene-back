import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAreaInput {
  @Field(() => String)
  @IsNotEmpty()
  name: string;
  @Field(() => String)
  @IsNotEmpty()
  description: string;
}
