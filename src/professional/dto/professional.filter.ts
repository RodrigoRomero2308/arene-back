import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class ProfessionalFilter {
  @Field({ nullable: true })
  dni?: string;

  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  speciality?: string;

  @Field({ nullable: true })
  profession?: string;

  @Field({ nullable: true })
  medical_license_number?: string;

  @Field({ nullable: true })
  email?: string;
}
