/** Program tables published as 8 household sizes followed by the amount per additional person. */
export const bySize = (row: number[], size: number): number => {
  const n = Math.max(1, Math.round(size));
  if (n <= 8) return row[n - 1];
  return row[7] + row[8] * (n - 8);
};
