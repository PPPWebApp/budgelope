import { Observable } from 'rxjs';

export class Category {
  $key?: string;
  id?: string;
  name: string;
  parent: string;
  parentId: string;
  sortingOrder: string;
  balance: number;
  children?: any;
  type?: string;
  allocations?: { [s: string]: { actual: number, planned: number} };
}

export interface CategoryId extends Category { id: string };
