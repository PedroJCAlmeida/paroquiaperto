/**
 * Password validation rules for Paróquia Perto
 * - Minimum 8 characters
 * - At least 1 uppercase letter
 * - At least 1 number
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password) {
    errors.push('A palavra-passe é obrigatória.');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Mínimo 8 caracteres');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Pelo menos 1 letra MAIÚSCULA');
  }

  if (!/\d/.test(password)) {
    errors.push('Pelo menos 1 número');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function getPasswordValidationMessage(errors: string[]): string {
  if (errors.length === 0) {
    return '';
  }
  return `Sua senha precisa de: ${errors.join(', ')}`;
}
