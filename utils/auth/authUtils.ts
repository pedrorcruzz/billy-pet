/**
 * Validação de usuário e senha — Billy Pet
 */

/** Usuário: letras, números e _ (sem hífen, sem espaços). Ex: nick_nick, nickNick */
const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;

/** Senha: mínimo 4 caracteres, 1 maiúscula, 1 símbolo */
const UPPERCASE_REGEX = /[A-Z]/;
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;

export const AUTH_HINTS = {
  username:
    'Usuário: apenas letras, números e _ (sem hífen, sem espaços). Ex: nick_nick, nickNick',
  password:
    'Senha: mínimo 4 caracteres, 1 letra maiúscula e 1 símbolo (!@#$% etc.)',
} as const;

export function validateUsername(value: string): string | null {
  if (!value.trim()) return 'Usuário é obrigatório';
  if (value.includes('-')) return 'Usuário não pode conter hífen (-)';
  if (value.includes(' ')) return 'Usuário não pode conter espaços';
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
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(value)) return 'E-mail inválido';
  return null;
}
