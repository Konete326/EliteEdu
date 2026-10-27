export const validateEmail = (email) => {
  if (!email || !email.trim()) return false;
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  return re.test(email.trim());
};

export const validatePhone = (phone) => {
  if (!phone || !phone.trim()) return false;
  const clean = phone.replace(/[\s-]/g, '');
  const re = /^((\+92)|(0092)|(0))?3[0-9]{9}$/;
  return re.test(clean);
};

export const formatCnic = (val) => {
  if (!val) return '';
  const digits = val.replace(/\D/g, '').slice(0, 13);
  let res = '';
  if (digits.length > 0) res += digits.slice(0, 5);
  if (digits.length >= 6) res += '-' + digits.slice(5, 12);
  if (digits.length >= 13) res += '-' + digits.slice(12, 13);
  return res;
};

export const validateCnic = (cnic) => {
  if (!cnic) return false;
  const re = /^\d{5}-\d{7}-\d{1}$/;
  return re.test(cnic.trim());
};

export const getPasswordStrength = (pass) => {
  if (!pass) return { score: 0, label: 'Empty', color: 'text-ink-muted bg-surface-secondary' };
  let score = 0;
  if (pass.length >= 6) score += 1;
  if (pass.length >= 8) score += 1;
  if (/[0-9]/.test(pass)) score += 1;
  if (/[A-Z]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;

  if (score <= 1) return { score: 1, label: 'Weak', color: 'text-rose-600 bg-rose-500' };
  if (score === 2) return { score: 2, label: 'Fair', color: 'text-amber-600 bg-amber-500' };
  if (score === 3) return { score: 3, label: 'Good', color: 'text-blue-600 bg-blue-500' };
  return { score: 4, label: 'Strong', color: 'text-emerald-600 bg-emerald-500' };
};
