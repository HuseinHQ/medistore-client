export type Item = {
  id: number;
  name: string;
  price: number;
  imgUrl: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

export type TransactionDetail = {
  ItemId: number;
  TransactionId: number;
  createdAt: string;
  id: number;
  price: number;
  quantity: number;
  totalPrice: number;
  updatedAt: string;
  Item: Item;
};

export type Transaction = {
  TransactionDetails: TransactionDetail[];
  UserId: number;
  createdAt: string;
  id: number;
  orderId: string;
  snapToken: string;
  snapUrl: string;
  status: 'pending' | 'success' | 'failure';
  total: number;
  updatedAt: string;
};
