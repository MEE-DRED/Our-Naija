export const formatNaira = (n: number): string => `₦${Math.round(n).toLocaleString('en-NG')}`;
export const formatPercent = (n: number): string => `${Math.round(n)}%`;
