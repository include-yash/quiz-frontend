export const validatePassword = (password) => {
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
    return {
      isValid: password.length >= minLength && 
               hasUpperCase && 
               hasLowerCase && 
               hasNumber && 
               hasSpecialChar,
      requirements: {
        minLength: password.length >= minLength,
        hasUpperCase,
        hasLowerCase,
        hasNumber,
        hasSpecialChar
      }
    };
  };
  
  export const validateEmail = (email) => {
    return /^[a-z]+\.[a-z]{2}\d{2}@bmsce\.ac\.in$/i.test(email);
  };
  
  export const validateUSN = (usn) => {
    return /^1BM\d{2}[A-Z]{2}\d{3}$/.test(usn.toUpperCase());
  };