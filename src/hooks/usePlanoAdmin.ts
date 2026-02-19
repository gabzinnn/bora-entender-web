import { useQuery } from '@tanstack/react-query';
import api from '../services/axios';

export interface PlanoAdmin {
    id: number;
    nome: string;
    preco: number;
    precoOriginal?: number | null;
    stripePriceId: string;
    periodo: 'MENSAL' | 'ANUAL';
    popular: boolean;
    allowPix: boolean;
    ativo: boolean;
    beneficios: string[];
    materiasIds: number[];
    _count?: {
        materias: number;
    };
}

export async function fetchPlanosAdmin(): Promise<PlanoAdmin[]> {
    const response = await api.get('/plano'); // Endpoint do backend
    return response.data;
}

export default function usePlanoAdmin() {
    return useQuery({
        queryKey: ['planosAdmin'],
        queryFn: fetchPlanosAdmin,
        staleTime: 1000 * 60 * 5, // 5 minutos
    });
}
