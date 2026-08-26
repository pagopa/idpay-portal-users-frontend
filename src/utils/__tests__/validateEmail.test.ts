import { isValidEmail, normalizeEmail } from '../validateEmail';

describe('validateEmail', () => {
  it('normalizes an email to lowercase', () => {
    expect(normalizeEmail('Test@Test.com')).toBe('test@test.com');
  });

  it('accepts a valid email containing uppercase characters', () => {
    expect(isValidEmail('Test@Test.com')).toBe(true);
  });
});
