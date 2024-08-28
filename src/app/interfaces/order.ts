export interface Order {
  id: number;
  reference: string;
  totalAmount: number;
  userId: number;
  createdAt: string;
  lastModifiedDate: string;
}

export interface OrderLineItemResponse {
  product: {
    id: number;
    name: string;
    price: number;
  };
  quantity: number;
}
