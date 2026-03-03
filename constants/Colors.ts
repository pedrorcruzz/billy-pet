const greenSecondary = '#497700';
const brownCard = '#C25A14';
const grayDark = '#2E2E2C';
const whiteLight = '#FFF';
const grayHint = '#6B7280';
const grayBorder = '#9CA3AF';
const redError = '#B91C1C';

export default {
  light: {
    text: grayDark,
    background: whiteLight,
    tint: greenSecondary,
    secondary: greenSecondary,
    card: brownCard,
    tabIconDefault: '#ccc',
    tabIconSelected: greenSecondary,
    /** Texto de dica/hint (ex: regras de senha) */
    hint: grayHint,
    /** Borda de inputs */
    inputBorder: grayBorder,
    /** Mensagens de erro (validação, login/cadastro falhou) */
    error: redError,
    /** Texto em botões primários (ex: fundo verde) */
    onTint: whiteLight,
  },
};
