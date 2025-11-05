import * as Yup from 'yup';

const emailSchema = Yup.string().email().required();

export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.validateSync(email);
    return true;
  } catch {
    return false;
  }
};

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}