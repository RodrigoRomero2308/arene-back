import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateAppointmentInput {
  @Field(() => Int)
  @IsNotEmpty()
  treatment_id: number;
  @Field(() => Int)
  @IsNotEmpty()
  professional_id: number;
  @Field(() => String)
  @IsNotEmpty()
  day_of_the_week: string;
  @Field(() => String)
  @IsNotEmpty()
  start_hour: string;
  @Field(() => String)
  @IsNotEmpty()
  end_hour: string;
}
