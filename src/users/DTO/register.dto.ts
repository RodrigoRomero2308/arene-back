import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNumberString } from 'class-validator';

@InputType()
export class RegisterUserDTO {
  @Field()
  @IsNumberString({}, { message: 'El dni debe contener solo números' })
  dni: string;
  @Field()
  @IsEmail({}, { message: 'El email no es válido' })
  email: string;
  @Field()
  firstname: string;
  @Field()
  lastname: string;
  @Field()
  password: string;
  @Field()
  phone: string;
}
