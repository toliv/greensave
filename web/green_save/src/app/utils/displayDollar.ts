export const displayDollar = (valueInCents: number): string => {
  return `$${Math.round(valueInCents / 100).toLocaleString()}`;
};
