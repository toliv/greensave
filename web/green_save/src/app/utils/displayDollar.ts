export const displayDollar = (valueInCents: number): string => {
  const dollars = valueInCents / 100;
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });
  return formatter.format(dollars);
};
