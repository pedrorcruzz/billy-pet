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
