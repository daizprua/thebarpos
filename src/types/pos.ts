export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  imageUrl?: string;
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Sale {
  id: number;
  items: CartItem[];
  total: number;
  date: string;
}