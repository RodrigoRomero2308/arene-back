import { Field, InputType, Int } from '@nestjs/graphql';

@InputType()
export class PatientInformationFilter {
  @Field(() => Int, { nullable: true })
  patient_id?: number;

  @Field(() => Int, { nullable: true })
  created_by?: number;

  @Field({ nullable: true })
  date_from?: Date;

  @Field({ nullable: true })
  date_to?: Date;
}
