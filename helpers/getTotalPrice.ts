interface ItemWithPriceAndQuantity {
  price: number;
  quantity: number;
}

export default function getTotalPrice<T extends ItemWithPriceAndQuantity>(items: T[]): number {
  return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
}
