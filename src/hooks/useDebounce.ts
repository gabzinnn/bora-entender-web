import { useEffect, useState } from 'react';

/**
 * Hook genérico de debounce.
 * Atrasa a atualização do valor até que o usuário pare de digitar.
 *
 * @param value  Valor a ser debounced
 * @param delay  Delay em ms (padrão: 400ms)
 */
export function useDebounce<T>(value: T, delay = 400): T {
    const [debounced, setDebounced] = useState<T>(value);

    useEffect(() => {
        const id = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(id);
    }, [value, delay]);

    return debounced;
}
