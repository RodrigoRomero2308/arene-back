import { CreateAddressInput } from '@/address/dto/createAddressInput';
import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsNumberString } from 'class-validator';

@InputType()
export class CreateOnlyUserInput {
  @Field()
  @IsNotEmpty({ message: 'El DNI no puede estar vacío' })
  @IsNumberString(undefined, { message: 'El DNI debe contener solo números' })
  dni: string;
  @Field()
  @IsNotEmpty({ message: 'El email no puede estar vacío' })
  @IsEmail(undefined, {
    message: 'El email ingresado no es válido',
  })
  email: string;
  @Field()
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  firstname: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El género no puede estar vacío' })
  gender?: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El estado civil no puede estar vacío' })
  marital_status?: string;
  @Field()
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  lastname: string;
  @Field()
  @IsNotEmpty({ message: 'La contraseña no puede estar vacía' })
  password: string;
  @Field()
  birth_date: string;
  @Field({ nullable: true })
  phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El numero de teléfono no puede estar vacío' })
  phone_number?: string;
}

@InputType()
export class CreateUserInput extends CreateOnlyUserInput {
  @Field(() => CreateAddressInput, { nullable: true })
  address?: CreateAddressInput;
}
