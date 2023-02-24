import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class PatientFilter {
  @Field({ nullable: true })
  dni?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  area_id?: number;

  @Field({ nullable: true })
  patient_status_id?: number;
}
