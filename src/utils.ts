export const asCurrency = (number: number): string =>
  Intl.NumberFormat("en-us", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(number);
