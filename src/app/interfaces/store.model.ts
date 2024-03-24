export interface Store {
  id: number;
  name: string;
  address: string;
  discount: number;
  notes: string;
  days: string;
}

export interface CreateStore {
  name: string;
  address: string;
  discount: number;
  days: string;
}