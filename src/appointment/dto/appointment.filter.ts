import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class AppointmentFilter {
  @Field({ nullable: true })
  id?: number;
  @Field({ nullable: true })
  treatment_id?: number;
  @Field({ nullable: true })
  professional_id?: number;
  @Field({ nullable: true })
  day_of_the_week?: string;
  @Field({ nullable: true })
  start_hour?: string;
  @Field({ nullable: true })
  end_hour?: string;
}
