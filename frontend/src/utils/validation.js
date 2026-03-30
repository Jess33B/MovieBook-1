// Input Validation Utilities

// Gmail validation (Gmail only)
const gmailValidation = {
  required: true,
  pattern: /^[a-zA-Z0-9._%+-]+@gmail\.com$/,
  message: 'Please enter a valid Gmail address (username@gmail.com)'
};

// Gmail validation function - STRICT: must end exactly with @gmail.com
function isValidGmail(email) {
  const regex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
  return regex.test(email);
}

// Phone number validation (exactly 10 digits)
const phoneValidation = {
  required: false,
  pattern: /^\d{10}$/,
  message: 'Please enter exactly 10 digits (numbers only)'
};

// Phone validation function - STRICT: exactly 10 digits
function isValidPhone(phone) {
  const phonePattern = /^\d{10}$/;
  return phonePattern.test(phone);
}

// Full name validation
const nameValidation = {
  required: true,
  minLength: 2,
  maxLength: 50,
  pattern: /^[a-zA-Z\s]+$/,
  message: 'Full name must only contain letters and spaces'
};

// Password validation
const passwordValidation = {
  required: true,
  minLength: 8,
  pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
  message: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character'
};

// Password strength checker
function checkPasswordStrength(password) {
  if (!password) return { strength: 'weak', score: 0, message: 'Please enter a password' };
  
  let score = 0;
  let feedback = [];
  
  // Length check
  if (password.length >= 8) {
    score += 1;
  } else {
    feedback.push('at least 8 characters');
  }
  
  // Uppercase check
  if (/[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one uppercase letter');
  }
  
  // Lowercase check
  if (/[a-z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one lowercase letter');
  }
  
  // Number check
  if (/\d/.test(password)) {
    score += 1;
  } else {
    feedback.push('one number');
  }
  
  // Special character check
  if (/[@$!%*?&]/.test(password)) {
    score += 1;
  } else {
    feedback.push('one special character (@$!%*?&)');
  }
  
  // Determine strength
  let strength;
  if (score === 5) {
    strength = 'strong';
  } else if (score >= 3) {
    strength = 'medium';
  } else {
    strength = 'weak';
  }
  
  const message = feedback.length > 0 ? `Missing: ${feedback.join(', ')}` : 'Strong password!';
  
  return { strength, score, message };
}

// Movie title validation
const movieTitleValidation = {
  required: true,
  minLength: 1,
  maxLength: 100,
  pattern: /^[a-zA-Z0-9\s:.,'-]+$/,
  message: 'Movie title contains invalid characters'
};

// Price validation
const priceValidation = {
  required: true,
  min: 0,
  max: 9999,
  message: 'Price must be between 0 and 9999'
};

// Date validation
const dateValidation = {
  required: true,
  pattern: /^\d{4}-\d{2}-\d{2}$/,
  message: 'Date must be in YYYY-MM-DD format'
};

// Time validation
const timeValidation = {
  required: true,
  pattern: /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/,
  message: 'Time must be in HH:MM format'
};

// File validation
function validateFile(file) {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, message: 'Only JPEG, PNG, and WebP images are allowed' };
  }
  
  if (file.size > maxSize) {
    return { valid: false, message: 'File size must be less than 5MB' };
  }
  
  return { valid: true };
}

// Comprehensive validation function
function validateField(fieldName, value, customRules) {
  const rules = { ...customRules };
  
  if (rules.required && (!value || value.toString().trim() === '')) {
    return { valid: false, message: `${fieldName} is required` };
  }
  
  if (rules.minLength && value.toString().length < rules.minLength) {
    return { valid: false, message: `${fieldName} must be at least ${rules.minLength} characters` };
  }
  
  if (rules.maxLength && value.toString().length > rules.maxLength) {
    return { valid: false, message: `${fieldName} must be no more than ${rules.maxLength} characters` };
  }
  
  if (rules.min && parseFloat(value) < rules.min) {
    return { valid: false, message: `${fieldName} must be at least ${rules.min}` };
  }
  
  if (rules.max && parseFloat(value) > rules.max) {
    return { valid: false, message: `${fieldName} must be no more than ${rules.max}` };
  }
  
  if (rules.pattern && !rules.pattern.test(value.toString())) {
    return { valid: false, message: rules.message };
  }
  
  return { valid: true };
}

// XSS Prevention
function sanitizeInput(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*<\/script>|<\/script>)/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
}

// SQL Injection Prevention
function sanitizeSQL(input) {
  if (typeof input !== 'string') return input;
  
  return input
    .replace(/['"\\;]/g, '')
    .replace(/--/g, '')
    .replace(/\/\*/g, '')
    .replace(/\b(DROP|DELETE|INSERT|UPDATE|CREATE|ALTER|EXEC|UNION|SELECT)\b/gi, '')
    .trim();
}

// Export all validation functions
export {
  gmailValidation,
  phoneValidation,
  nameValidation,
  passwordValidation,
  movieTitleValidation,
  priceValidation,
  dateValidation,
  timeValidation,
  validateFile,
  sanitizeInput,
  sanitizeSQL,
  isValidGmail,
  isValidPhone,
  validateField,
  checkPasswordStrength
};
