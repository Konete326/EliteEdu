export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^.{6,}$/;
export const PHONE_REGEX = /^(\+92|0)?[0-9]{10,11}$/;
export const CODE_REGEX = /^[A-Za-z0-9_-]{2,10}$/;

export const isValidEmail = (email) => {
  return EMAIL_REGEX.test(String(email).trim());
};

export const isValidPassword = (password) => {
  return PASSWORD_REGEX.test(String(password));
};

export const isValidPhone = (phone) => {
  if (!phone) return true;
  return PHONE_REGEX.test(String(phone).replace(/[\s-]/g, ''));
};

export const isValidCode = (code) => {
  return CODE_REGEX.test(String(code).trim());
};
