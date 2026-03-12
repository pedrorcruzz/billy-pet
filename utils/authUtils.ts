import { z } from "zod";

const USERNAME_REGEX = /^[a-zA-Z0-9_]+$/;
const UPPERCASE_REGEX = /[A-Z]/;
const SYMBOL_REGEX = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const nameSchema = z
  .string()
  .trim()
  .min(1, "Nome é obrigatório")
  .min(2, "Nome deve ter pelo menos 2 caracteres");

const usernameSchema = z
  .string()
  .trim()
  .min(1, "Usuário é obrigatório")
  .max(20, "Usuário não pode passar de 20 caracteres")
  .refine((value) => !value.includes(" "), {
    message: "Usuário não pode conter espaço",
  })
  .refine((value) => USERNAME_REGEX.test(value), {
    message: "Use apenas letras, números e _",
  });

const passwordSchema = z
  .string()
  .min(1, "Senha é obrigatória")
  .min(4, "Senha deve ter no mínimo 4 caracteres")
  .refine((value) => UPPERCASE_REGEX.test(value), {
    message: "Senha deve ter pelo menos 1 letra maiúscula",
  })
  .refine((value) => SYMBOL_REGEX.test(value), {
    message: "Senha deve ter pelo menos 1 símbolo (!@#$% etc.)",
  });

const emailSchema = z
  .string()
  .trim()
  .min(1, "E-mail é obrigatório")
  .refine((value) => EMAIL_REGEX.test(value), {
    message:
      "E-mail inválido. Deve conter @ e domínio, ex: usuario@gmail.com",
  });

const emailOrUserSchema = z
  .string()
  .trim()
  .min(1, "E-mail ou usuário é obrigatório");

const passwordRequiredSchema = z
  .string()
  .min(1, "Senha é obrigatória");

export const AUTH_HINTS = {
  username:
    'Usuário: apenas letras, números e _ (sem hífen, sem espaços). Ex: nick_nick, nickNick',
  password:
    'Senha: mínimo 4 caracteres, 1 letra maiúscula e 1 símbolo (!@#$% etc.)',
} as const;

export const REGISTER_HINTS = {
  username:
    'Usuário: não pode conter espaço e não pode passar de 20 caracteres',
  email: 'E-mail: deve conter @ e domínio, ex: usuario@gmail.com',
  password:
    'Senha: mínimo 4 caracteres, 1 letra maiúscula e 1 símbolo (!@#$% etc.)',
} as const;

export function validateName(value: string): string | null {
  const result = nameSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validateUsername(value: string): string | null {
  const result = usernameSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validatePassword(value: string): string | null {
  const result = passwordSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validateEmail(value: string): string | null {
  const result = emailSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validateEmailOrUser(value: string): string | null {
  const result = emailOrUserSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validatePasswordRequired(value: string): string | null {
  const result = passwordRequiredSchema.safeParse(value);
  if (result.success) return null;
  return result.error.issues[0]?.message ?? null;
}

export function validateConfirmPassword(
  password: string,
  confirmValue: string,
): string | null {
  if (!confirmValue) return null;

  const result = z
    .object({
      password: passwordSchema,
      confirmPassword: z.string(),
    })
    .refine(
      (data) => data.password === data.confirmPassword,
      { path: ["confirmPassword"], message: "As senhas não conferem" },
    )
    .safeParse({ password, confirmPassword: confirmValue });

  if (result.success) return null;

  const confirmIssue = result.error.issues.find(
    (issue) => issue.path[0] === "confirmPassword",
  );

  return confirmIssue?.message ?? null;
}
