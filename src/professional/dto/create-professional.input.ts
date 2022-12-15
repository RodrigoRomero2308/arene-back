import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';
import { CreateUserInput } from '@/users/DTO/createUserInput';

@InputType()
export class CreateProfessionalWithoutUserInput {
  @Field()
  @IsNotEmpty({ message: 'El campo profesión no puede estar vació' })
  profession: string;
  @Field()
  @IsNotEmpty({ message: 'El campo especialidad no puede estar vació' })
  speciality: string;
  @Field()
  @IsNotEmpty({ message: 'El campo CUD no puede estar vacío' })
  medical_license_number: string;
}

@InputType()
export class CreateProfessionalInput extends CreateUserInput {
  @Field(() => CreateProfessionalWithoutUserInput)
  professional: CreateProfessionalWithoutUserInput;
}
