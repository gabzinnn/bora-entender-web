import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

export type Topico = {
    id: number;
    titulo: string;
    ordem: number;
    duracaoMin: number;
    totalConteudos: number;
};

export type Materia = {
    id: number;
    nome: string;
    descricao: string;
    icone: any;
    cor: string;
    totalTopicos: number;
    totalConteudos: number;
    tempoTotalMin: number;
    totalAlunos: number;
    engajamentoSemanal: number[];
    topicos: Topico[];
};

async function fetchMateriasAdmin(search?: string): Promise<Materia[]> {
    const params = search ? { search } : {};
    const response = await api.get('/materia/admin/lista', { params });
    return response.data;
}

export default function useMateriaAdmin(search?: string) {
    return useQuery({
        queryKey: ['materiasAdmin', search ?? ''],
        queryFn: () => fetchMateriasAdmin(search),
        staleTime: 1000 * 60 * 5,
        placeholderData: (prev) => prev, // mantém dados anteriores enquanto busca
    });
}