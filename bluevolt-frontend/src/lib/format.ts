export const inr = (paise: number | null | undefined) => {
  if (paise == null) return "On request";
  const rupees = paise / 100;
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(rupees);
};

export const discountPct = (mrp: number, ours: number) => {
  if (!mrp || mrp <= ours) return 0;
  return Math.round(((mrp - ours) / mrp) * 100);
};
