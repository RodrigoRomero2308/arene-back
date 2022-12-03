import { OrderByDirection } from '@/common/orderBy.direction.args';
import { IOrderByInput } from '@/common/orderBy.interface';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum PatientInformationOrderByField {
  its = 'its',
}

registerEnumType(PatientInformationOrderByField, {
  name: 'PatientInformationOrderByField',
});

@InputType()
export class PatientInformationOrderByInput
  implements IOrderByInput<PatientInformationOrderByField>
{
  @Field(() => PatientInformationOrderByField)
  field: PatientInformationOrderByField;

  @Field(() => OrderByDirection)
  direction: OrderByDirection;
}
