import { InputType, Int, Field } from '@nestjs/graphql';
import { IsNotEmpty } from 'class-validator';

@InputType()
export class CreateTreatmentInput {
  @Field(() => Int)
  @IsNotEmpty()
  area_id: number;
  @Field(() => Int)
  @Field({ nullable: true })
  quantity: number;
  @Field(() => Int)
  @IsNotEmpty()
  patient_id: number;
}
