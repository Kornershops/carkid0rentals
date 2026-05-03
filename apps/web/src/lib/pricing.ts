export type RentalDuration = "30 Min" | "1 Hour" | "12 Hours" | "24 Hours" | "3 Days" | "7 Days";

export const DURATION_FACTORS: Record<RentalDuration, number> = {
  "30 Min": 0.15,     // 15% of daily rate (convenience premium)
  "1 Hour": 0.25,     // 25% of daily rate
  "12 Hours": 0.65,   // 65% of daily rate
  "24 Hours": 1.0,    // 100% of daily rate
  "3 Days": 2.7,      // 10% discount on daily rate (0.9 * 3)
  "7 Days": 5.6,      // 20% discount on daily rate (0.8 * 7)
};

export function calculatePrice(basePricePerDay: number, duration: RentalDuration): number {
  const factor = DURATION_FACTORS[duration];
  return Math.round(basePricePerDay * factor);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  }).format(price);
}
