import { CreateUserInput } from '@/users/DTO/createUserInput';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePatientWithoutUserInput {
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El nombre del acompañante no puede estar vacío' })
  companion_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El apellido del acompañante no puede estar vacío' })
  companion_lastname?: string;
  @Field(() => Int, { nullable: true })
  companion_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty({
    message: 'El número de teléfono del acompañante no puede estar vacío',
  })
  companion_phone_number?: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El nombre del responsable no puede estar vacío' })
  responsible_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El apellido del responsable no puede estar vacío' })
  responsible_lastname?: string;
  @Field(() => Int, { nullable: true })
  responsible_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty({
    message: 'El número de teléfono del responsable no puede estar vacío',
  })
  responsible_phone_number?: string;
  @Field({ nullable: true })
  @IsNotEmpty({
    message: 'El nombre del médico de cabecera no puede estar vacío',
  })
  primary_doctor_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty({
    message: 'El apellido del médico de cabecera no puede estar vacío',
  })
  primary_doctor_lastname?: string;
  @Field(() => Int, { nullable: true })
  primary_doctor_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty({
    message:
      'El número de teléfono del médico de cabecera no puede estar vacío',
  })
  primary_doctor_phone_number?: string;
  @Field()
  @IsNotEmpty({ message: 'El diagnóstico no puede estar vacío' })
  diagnose: string;
  @Field()
  diagnose_date: string;
  @Field()
  needs_transfer: boolean;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'La forma de traslado no puede estar vacía' })
  transfer?: string;
  @Field({ nullable: true })
  @IsNotEmpty({ message: 'El responsable de traslado no puede estar vacío' })
  transfer_responsible?: string;
  @Field(() => Int, { nullable: true })
  transfer_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty({
    message: 'El número de teléfono del traslado no puede estar vacío',
  })
  transfer_phone_number?: string;
  @Field({ nullable: true })
  cud_number?: string;
  @Field({ nullable: true })
  cud_companion?: boolean;
  @Field({ nullable: true })
  cud_valid_from?: string;
  @Field({ nullable: true })
  cud_valid_to?: string;
  @Field({ nullable: true })
  social_work?: string;
  @Field({ nullable: true })
  social_work_plan?: string;
  @Field({ nullable: true })
  social_work_number?: string;
  @Field({ nullable: true })
  social_work_valid_from?: string;
  @Field({ nullable: true })
  social_work_valid_to?: string;
}

@InputType()
export class CreatePatientInput extends CreateUserInput {
  @Field(() => CreatePatientWithoutUserInput)
  patient: CreatePatientWithoutUserInput;
}
