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

async function fetchMateriasAdmin(): Promise<Materia[]> {
    const response = await api.get('/materia/admin/lista');
    return response.data;
}

export default function useMateriaAdmin() {
    return useQuery({
        queryKey: ['materiasAdmin'],
        queryFn: fetchMateriasAdmin,
        staleTime: 1000 * 60 * 5, // 5 minutos
    })
}