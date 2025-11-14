//custom breakpoints for responsive barcode
export const BARCODE_BREAKPOINTS = {
  large: '(min-width:1300px)',
  medium: '(min-width:1145px) and (max-width:1299px)',
  small: '(min-width:900px) and (max-width:1020px)',
} as const;

export const getBarcodeWidth = (
  isLarge: boolean,
  isMedium: boolean,
  isSmall: boolean
): number => {
  if (isLarge) return 3;
  if (isMedium) return 2.5;
  if (isSmall) return 1.5;
  return 2;
};