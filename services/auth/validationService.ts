/**
 * Regras de validação para autenticação — Billy Pet
 * Centraliza validações de login e cadastro.
 */

/** Usuário: letras, números e _ (sem hífen, sem espaços). Ex: nick_nick, nickNick */
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/** Senha: mínimo 4 caracteres, 1 maiúscula, 1 símbolo */
const UPPERCASE_REGEX = /[A-Z]/;
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

/** E-mail: formato básico com @ e domínio */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const AUTH_HINTS = {
  username:
    'Usuário: apenas letras, números e _ (sem hífen, sem espaços). Ex: nick_nick, nickNick',
  password:
    'Senha: mínimo 4 caracteres, 1 letra maiúscula e 1 símbolo (!@#$% etc.)',
} as const;

/** Regras para cadastro — exibidas ao clicar no ícone de dica */
export const REGISTER_HINTS = {
  username:
    'Usuário: não pode conter espaço e não pode passar de 20 caracteres',
  email: 'E-mail: deve conter @ e domínio, ex: usuario@gmail.com',
  password:
    'Senha: mínimo 4 caracteres, 1 letra maiúscula e 1 símbolo (!@#$% etc.)',
} as const;

export function validateName(value: string): string | null {
  if (!value.trim()) return 'Nome é obrigatório';
  if (value.trim().length < 2) return 'Nome deve ter pelo menos 2 caracteres';
  return null;
}

export function validateUsername(value: string): string | null {
  if (!value.trim()) return 'Usuário é obrigatório';
  if (value.includes(' ')) return 'Usuário não pode conter espaço';
  if (value.length > 20) return 'Usuário não pode passar de 20 caracteres';
  if (!USERNAME_REGEX.test(value)) return 'Use apenas letras, números e _';
  return null;
}

export function validatePassword(value: string): string | null {
  if (!value) return 'Senha é obrigatória';
  if (value.length < 4) return 'Senha deve ter no mínimo 4 caracteres';
  if (!UPPERCASE_REGEX.test(value)) return 'Senha deve ter pelo menos 1 letra maiúscula';
  if (!SYMBOL_REGEX.test(value)) return 'Senha deve ter pelo menos 1 símbolo (!@#$% etc.)';
  return null;
}

export function validateEmail(value: string): string | null {
  if (!value.trim()) return 'E-mail é obrigatório';
  if (!EMAIL_REGEX.test(value))
    return 'E-mail inválido. Deve conter @ e domínio, ex: usuario@gmail.com';
  return null;
}

/** Validação de login: e-mail ou usuário obrigatório */
export function validateEmailOrUser(value: string): string | null {
  if (!value.trim()) return 'E-mail ou usuário é obrigatório';
  return null;
}

/** Validação de login: senha obrigatória */
export function validatePasswordRequired(value: string): string | null {
  if (!value) return 'Senha é obrigatória';
  return null;
}

/** Validação de confirmação de senha */
export function validateConfirmPassword(
  password: string,
  confirmValue: string
): string | null {
  if (!confirmValue) return null;
  return password !== confirmValue ? 'As senhas não conferem' : null;
}
