const greenSecondary = '#497700';
const brownCard = '#C25A14';
const grayDark = '#2E2E2C';
const whiteLight = '#FFF';
const grayHint = '#6B7280';
const grayBorder = '#9CA3AF';
const graySeparator = '#EEEEEE';
const redError = '#B91C1C';
const shadowBlack = '#000';

export default {
  light: {
    text: grayDark,
    background: whiteLight,
    tint: greenSecondary,
    secondary: greenSecondary,
    card: brownCard,
    /** Ícone da tab não selecionado */
    tabIconDefault: grayDark,
    /** Ícone da tab selecionado (destaque) */
    tabIconSelected: greenSecondary,
    /** Texto de dica/hint (ex: regras de senha) */
    hint: grayHint,
    /** Borda de inputs */
    inputBorder: grayBorder,
    /** Mensagens de erro (validação, login/cadastro falhou) */
    error: redError,
    /** Texto em botões primários (ex: fundo verde) */
    onTint: whiteLight,
    /** Linha separadora/divider */
    separator: graySeparator,
    /** Cor de sombra (tab bar, cards) */
    shadow: shadowBlack,
  },
};
