export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  const alphanumericRegex = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{6,}$/;
  return alphanumericRegex.test(password);
};

export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,50}$/;
  return nameRegex.test(name.trim());
};

export const getValidationMessage = (field, value) => {
  switch (field) {
    case 'email':
      return !validateEmail(value) ? 'Please enter a valid email address' : '';
    case 'password':
      return !validatePassword(value) ? 'Password must be at least 6 characters with letters and numbers' : '';
    case 'name':
      return !validateName(value) ? 'Name must contain only letters and be 2-50 characters long' : '';
    default:
      return '';
  }
};