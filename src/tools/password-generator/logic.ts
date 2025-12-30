/**
 * Password Generator Logic
 */

export interface PasswordOptions {
  length: number;
  includeUppercase: boolean;
  includeLowercase: boolean;
  includeNumbers: boolean;
  includeSymbols: boolean;
  excludeSimilar: boolean;
  excludeAmbiguous: boolean;
}

export interface PasswordStrength {
  score: number; // 0-4
  label: 'Very Weak' | 'Weak' | 'Fair' | 'Strong' | 'Very Strong';
  feedback: string[];
}

const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';
const SIMILAR_CHARS = 'il1Lo0O';
const AMBIGUOUS_CHARS = '{}[]()/\\\'"`~,;:.<>';

/**
 * Generate a random password based on options
 */
export function generatePassword(options: PasswordOptions): string {
  let charset = '';
  
  if (options.includeUppercase) charset += UPPERCASE;
  if (options.includeLowercase) charset += LOWERCASE;
  if (options.includeNumbers) charset += NUMBERS;
  if (options.includeSymbols) charset += SYMBOLS;

  if (charset.length === 0) {
    throw new Error('At least one character type must be selected');
  }

  // Remove similar characters if requested
  if (options.excludeSimilar) {
    charset = charset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }

  // Remove ambiguous characters if requested
  if (options.excludeAmbiguous) {
    charset = charset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
  }

  if (charset.length === 0) {
    throw new Error('No characters available with current exclusion settings');
  }

  // Generate password
  const password: string[] = [];
  const array = new Uint32Array(options.length);
  crypto.getRandomValues(array);

  for (let i = 0; i < options.length; i++) {
    password.push(charset[array[i] % charset.length]);
  }

  // Ensure at least one character from each selected type
  let result = password.join('');
  
  if (options.includeUppercase && !/[A-Z]/.test(result)) {
    result = replaceRandomChar(result, UPPERCASE, options);
  }
  if (options.includeLowercase && !/[a-z]/.test(result)) {
    result = replaceRandomChar(result, LOWERCASE, options);
  }
  if (options.includeNumbers && !/[0-9]/.test(result)) {
    result = replaceRandomChar(result, NUMBERS, options);
  }
  if (options.includeSymbols && !/[!@#$%^&*()_+\-=[\]{}|;:,.<>?]/.test(result)) {
    result = replaceRandomChar(result, SYMBOLS, options);
  }

  return result;
}

/**
 * Replace a random character in the password with a character from the given set
 */
function replaceRandomChar(password: string, charset: string, options: PasswordOptions): string {
  let availableCharset = charset;
  
  if (options.excludeSimilar) {
    availableCharset = availableCharset.split('').filter(char => !SIMILAR_CHARS.includes(char)).join('');
  }
  if (options.excludeAmbiguous) {
    availableCharset = availableCharset.split('').filter(char => !AMBIGUOUS_CHARS.includes(char)).join('');
  }

  if (availableCharset.length === 0) return password;

  const array = new Uint32Array(2);
  crypto.getRandomValues(array);
  
  const randomPos = array[0] % password.length;
  const randomChar = availableCharset[array[1] % availableCharset.length];
  
  return password.substring(0, randomPos) + randomChar + password.substring(randomPos + 1);
}

/**
 * Generate multiple passwords
 */
export function generatePasswords(count: number, options: PasswordOptions): string[] {
  const passwords: string[] = [];
  for (let i = 0; i < count; i++) {
    passwords.push(generatePassword(options));
  }
  return passwords;
}

/**
 * Calculate password strength
 */
export function calculateStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'Very Weak',
      feedback: ['Password is empty'],
    };
  }

  let score = 0;
  const feedback: string[] = [];

  // Length check
  if (password.length >= 12) {
    score += 2;
  } else if (password.length >= 8) {
    score += 1;
    feedback.push('Consider using at least 12 characters');
  } else {
    feedback.push('Password is too short (minimum 8 characters)');
  }

  // Character variety
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) {
    score += 1;
  } else {
    feedback.push('Use both uppercase and lowercase letters');
  }

  if (/[0-9]/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Include numbers');
  }

  if (/[^a-zA-Z0-9]/.test(password)) {
    score += 0.5;
  } else {
    feedback.push('Include special characters');
  }

  // Common patterns (reduce score)
  if (/(.)\1{2,}/.test(password)) {
    score -= 0.5;
    feedback.push('Avoid repeating characters');
  }

  if (/^[0-9]+$/.test(password)) {
    score -= 1;
    feedback.push('Avoid using only numbers');
  }

  if (/^[a-zA-Z]+$/.test(password)) {
    score -= 0.5;
    feedback.push('Add numbers or symbols');
  }

  // Clamp score
  score = Math.max(0, Math.min(4, score));

  // Determine label
  let label: PasswordStrength['label'];
  if (score >= 3.5) {
    label = 'Very Strong';
  } else if (score >= 2.5) {
    label = 'Strong';
  } else if (score >= 1.5) {
    label = 'Fair';
  } else if (score >= 0.5) {
    label = 'Weak';
  } else {
    label = 'Very Weak';
  }

  if (feedback.length === 0) {
    feedback.push('Great password!');
  }

  return {
    score: Math.round(score),
    label,
    feedback,
  };
}

/**
 * Generate a memorable passphrase
 */
export function generatePassphrase(wordCount: number = 4, separator: string = '-'): string {
  // Simple word list for memorable passphrases
  const words = [
    'alpha', 'bravo', 'charlie', 'delta', 'echo', 'foxtrot', 'golf', 'hotel',
    'india', 'juliet', 'kilo', 'lima', 'mike', 'november', 'oscar', 'papa',
    'quebec', 'romeo', 'sierra', 'tango', 'uniform', 'victor', 'whiskey', 'xray',
    'yankee', 'zulu', 'apple', 'banana', 'cherry', 'dragon', 'eagle', 'falcon',
    'galaxy', 'hammer', 'island', 'jungle', 'knight', 'laser', 'mountain', 'nebula',
    'ocean', 'penguin', 'quantum', 'rocket', 'sunset', 'thunder', 'unicorn', 'volcano',
    'warrior', 'phoenix', 'shadow', 'crystal', 'diamond', 'emerald', 'forest', 'glacier',
  ];

  const selected: string[] = [];
  const array = new Uint32Array(wordCount);
  crypto.getRandomValues(array);

  for (let i = 0; i < wordCount; i++) {
    selected.push(words[array[i] % words.length]);
  }

  return selected.join(separator);
}
