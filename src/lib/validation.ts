export const sanitizeText = (value: string): string => value.trim().replace(/\s+/g, ' ');

export const isValidName = (value: string): boolean => sanitizeText(value).length >= 2;
export const isValidCardTitle = (value: string): boolean => sanitizeText(value).length >= 1;

export const parsePositiveInt = (value: string): number | null => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.floor(parsed);
};
