import { OrderByDirection } from '@/common/orderBy.direction.args';
import { IOrderByInput } from '@/common/orderBy.interface';
import { Field, InputType, registerEnumType } from '@nestjs/graphql';

export enum DocumentationOrderByField {
  filename = 'filename',
  its = 'its',
}

registerEnumType(DocumentationOrderByField, {
  name: 'DocumentationOrderByField',
});

@InputType()
export class DocumentationOrderByInput
  implements IOrderByInput<DocumentationOrderByField>
{
  @Field(() => DocumentationOrderByField)
  field: DocumentationOrderByField;

  @Field(() => OrderByDirection)
  direction: OrderByDirection;
}
