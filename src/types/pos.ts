export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
}

export interface CartItem extends Product {
  quantity: number;
}