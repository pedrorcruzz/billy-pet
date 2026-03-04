/**
 * Formata valor numérico para preço em reais (pt-BR).
 */
export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}
