/**
 * Hook para validação com debounce — exibe erro após 500ms sem digitar
 */

import { useCallback, useEffect, useRef } from 'react';

type ValidateFn = (value: string) => string | null | undefined;
type OnResultFn = (err: string | undefined) => void;

export function useDebouncedValidation(delayMs = 500) {
  const timeoutsRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const debouncedValidate = useCallback(
    (key: string, value: string, validateFn: ValidateFn, onResult: OnResultFn) => {
      const prev = timeoutsRef.current[key];
      if (prev) clearTimeout(prev);
      timeoutsRef.current[key] = setTimeout(() => {
        const err = validateFn(value);
        onResult(err ?? undefined);
      }, delayMs);
    },
    [delayMs]
  );

  useEffect(() => {
    return () => {
      Object.values(timeoutsRef.current).forEach(clearTimeout);
    };
  }, []);

  return debouncedValidate;
}
