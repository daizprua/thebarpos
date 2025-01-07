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
  shiftId: number;
}

export interface Shift {
  id: number;
  startTime: string;
  endTime?: string;
  initialCash: number;
  totalSales: number;
  numberOfTransactions: number;
  startedBy?: string;
}