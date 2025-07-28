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