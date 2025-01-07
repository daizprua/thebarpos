import { Sale, CartItem } from "@/types/pos";

export const createSale = (
  cart: CartItem[],
  totalAmount: number,
  shiftId: number,
  paymentMethod: string
): Sale => {
  return {
    id: Date.now(),
    items: cart,
    total: totalAmount,
    date: new Date().toISOString(),
    shiftId: shiftId,
    paymentMethod: paymentMethod
  };
};

export const saveSale = (sale: Sale) => {
  const existingSales = JSON.parse(localStorage.getItem('sales') || '[]');
  localStorage.setItem('sales', JSON.stringify([...existingSales, sale]));
};