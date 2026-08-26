export const normalizeEmail = (email: string): string => email.toLowerCase();

export function isValidEmail(email: string): boolean {
  const emailRegex = /^(?=.{1,255}$)[A-Za-z0-9]([A-Za-z0-9+_-]*(\.[A-Za-z0-9+_-]+)*)?@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}$/;
  return emailRegex.test(normalizeEmail(email));
}