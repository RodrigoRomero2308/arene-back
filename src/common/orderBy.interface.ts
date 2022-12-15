import { OrderByDirection } from './orderBy.direction.args';

export interface IOrderByInput<T> {
  field: T;
  direction: OrderByDirection;
}
