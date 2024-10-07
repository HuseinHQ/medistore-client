interface ItemWithPriceAndQuantity {
  price: number;
  quantity: number;
}

export default function getTotalQuantity<T extends ItemWithPriceAndQuantity>(items: T[]): number {
  return items.reduce((acc, item) => acc + item.quantity, 0);
}
