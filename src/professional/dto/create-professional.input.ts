import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateUserInput } from '@/users/DTO/createUserInput';

@InputType()
export class CreateProfessionalWithoutUserInput {
  @Field()
  @IsNotEmpty()
  profession: string;
  @Field()
  @IsNotEmpty()
  speciality: string;
  @Field()
  @IsNotEmpty()
  medical_licencse_number: string;
}

@InputType()
export class CreateProfessionalInput extends CreateUserInput {
  @Field(() => CreateProfessionalWithoutUserInput)
  professional: CreateProfessionalWithoutUserInput;
}
