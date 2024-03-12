export function convertDollarStrToCents(dollarStr: string): number {
  // This handles the price we have in CSV
  // Remove the dollar sign and commas, then convert to a float
  const amountInDollars = parseFloat(dollarStr.replace(/[$,]/g, ""));
  // Convert dollars to cents
  const amountInCents = Math.round(amountInDollars * 100);
  return amountInCents;
}
