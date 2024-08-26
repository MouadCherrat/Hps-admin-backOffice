export interface Bill {
    id: number;
    totalAmount: number;
    paid: boolean;
    billReference: string;
    paymentMethod: string;
    createdAt: string;
    clientId: number;
    orderId: number;
  }
  