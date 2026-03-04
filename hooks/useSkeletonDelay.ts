import { useEffect, useState } from "react";

/**
 * Retorna true após delayMs quando isLoading é true.
 * Evita flash do skeleton em carregamentos muito rápidos.
 */
export function useSkeletonDelay(isLoading: boolean, delayMs = 300) {
  const [showSkeleton, setShowSkeleton] = useState(false);

  useEffect(() => {
    if (!isLoading) {
      setShowSkeleton(false);
      return;
    }

    const id = setTimeout(() => {
      setShowSkeleton(true);
    }, delayMs);

    return () => clearTimeout(id);
  }, [isLoading, delayMs]);

  return showSkeleton;
}
