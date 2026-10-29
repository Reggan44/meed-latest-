// Shipping fee (KSh) -> delivery days. Single source of truth for UI and server validation.
export const SHIPPING_DAYS = { 200: 3, 350: 2, 500: 1 };

export const deliveryDays = (fee) => SHIPPING_DAYS[Number(fee)] ?? 1;

export const formatKsh = (n) =>
  `KSh ${Number(n || 0).toLocaleString("en-KE", { maximumFractionDigits: 2 })}`;
