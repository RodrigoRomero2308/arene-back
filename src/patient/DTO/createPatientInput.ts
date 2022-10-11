import { CreateUserInput } from '@/users/DTO/createUserInput';
import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreatePatientWithoutUserInput {
  @Field({ nullable: true })
  @IsNotEmpty()
  companion_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  companion_lastname?: string;
  @Field(() => Int, { nullable: true })
  companion_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty()
  companion_phone_number?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  responsible_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  responsible_lastname?: string;
  @Field(() => Int, { nullable: true })
  responsible_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty()
  responsible_phone_number?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  primary_doctor_firstname?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  primary_doctor_lastname?: string;
  @Field(() => Int, { nullable: true })
  primary_doctor_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty()
  primary_doctor_phone_number?: string;
  @Field()
  @IsNotEmpty()
  diagnose: string;
  @Field()
  diagnose_date: string;
  @Field()
  needs_transfer: boolean;
  @Field({ nullable: true })
  @IsNotEmpty()
  transfer?: string;
  @Field({ nullable: true })
  @IsNotEmpty()
  transfer_responsible?: string;
  @Field(() => Int, { nullable: true })
  transfer_phone_type_id?: number;
  @Field({ nullable: true })
  @IsNotEmpty()
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
