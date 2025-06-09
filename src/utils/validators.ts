/**
 * Funções de validação comuns para uso em formulários e validações de dados
 */

/**
 * Verifica se uma string é um e-mail válido
 */
export const isValidEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Verifica se uma string tem pelo menos o tamanho mínimo especificado
 */
export const hasMinLength = (text: string, minLength: number): boolean => {
  return text.length >= minLength;
};

/**
 * Verifica se um valor é um número
 */
export const isNumber = (value: any): boolean => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Verifica se um valor é um número inteiro positivo
 */
export const isPositiveInteger = (value: any): boolean => {
  const num = Number(value);
  return Number.isInteger(num) && num > 0;
};

/**
 * Verifica se um valor está dentro de um intervalo
 */
export const isInRange = (value: number, min: number, max: number): boolean => {
  return value >= min && value <= max;
};

/**
 * Verifica se uma string contém apenas caracteres alfanuméricos
 */
export const isAlphanumeric = (text: string): boolean => {
  const regex = /^[a-zA-Z0-9]+$/;
  return regex.test(text);
};

/**
 * Verifica se uma senha é forte o suficiente
 * Deve conter pelo menos 8 caracteres, uma letra maiúscula, uma letra minúscula e um número
 */
export const isStrongPassword = (password: string): boolean => {
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return regex.test(password);
};
