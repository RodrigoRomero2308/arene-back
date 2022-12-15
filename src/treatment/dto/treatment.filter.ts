import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class TreatmentFilter {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  area_id?: number;
  @Field({ nullable: true })
  patient_id?: number;
}
