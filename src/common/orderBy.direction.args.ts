import { registerEnumType } from '@nestjs/graphql';

export enum OrderByDirection {
  asc = 'asc',
  desc = 'desc',
}

registerEnumType(OrderByDirection, {
  name: 'OrderByDirection',
});
