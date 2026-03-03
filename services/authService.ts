/**
 * Serviço de autenticação — Billy Pet
 * Dados mockados. Futuramente: chamadas à API.
 */

/** Credenciais mock: pedro@gmail.com ou pedro + Pedro1@ */
const MOCK_CREDENTIALS = {
  email: "pedro@gmail.com",
  user: "pedro",
  password: "Pedro1@",
};

export const authService = {
  login(emailOrUser: string, password: string): boolean {
    const normalized = emailOrUser.trim().toLowerCase();
    const isValid =
      (normalized === MOCK_CREDENTIALS.email ||
        normalized === MOCK_CREDENTIALS.user) &&
      password === MOCK_CREDENTIALS.password;
    return isValid;
  },
};
