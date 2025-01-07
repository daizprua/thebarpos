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
  paymentMethod: string;
}

export interface Expense {
  id: number;
  description: string;
  amount: number;
  shiftId: number;
  date: string;
}

export interface Shift {
  id: number;
  startTime: string;
  endTime?: string;
  initialCash: number;
  totalSales: number;
  numberOfTransactions: number;
  startedBy?: string;
  expenses?: Expense[];
}

export interface ShiftSummary {
  totalSales: number;
  totalExpenses: number;
  netTotal: number;
  paymentBreakdown: {
    [key: string]: number;
  };
  expenses: Expense[];
}