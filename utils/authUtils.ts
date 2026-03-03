/**
 * Re-exporta validações de autenticação.
 * Fonte: services/auth/validationService.ts
 * @deprecated Importe diretamente de @/services/auth/validationService
 */

export {
  AUTH_HINTS,
  REGISTER_HINTS,
  validateName,
  validateUsername,
  validatePassword,
  validateEmail,
} from '@/services/auth/validationService';
