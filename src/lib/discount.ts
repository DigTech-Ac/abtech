// src/utils/discount.ts

// Je vous ajoute un petit typage basique en attendant de peaufiner les types
interface CouponData {
  discountType: string;
  discountValue: number;
}

export function calculateDiscount(coupon: CouponData, originalAmount: number): number {
  if (coupon.discountType === "PERCENTAGE") {
    return Math.round(originalAmount * (coupon.discountValue / 100));
  } else {
    return Math.min(coupon.discountValue, originalAmount);
  }
}