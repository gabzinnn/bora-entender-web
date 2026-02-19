import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

interface MateriaComProgresso {
    id: string;
    nome: string;
    descricao: string;
    cor: string;
    icone: string;
    totalConteudos: number;
    conteudosConcluidos: number;
    percentualConcluido: number;
    status: 'EM_DIA' | 'ATRASADO' | 'NOVO';
}

export interface HomeResponse {
    aluno: {
        id: string;
        nome: string;
        anoEscolar: string;
        nivelEnsino: string;
    };
    materias: MateriaComProgresso[];
    estatisticas: {
        tarefasFeitas: number;
        tarefasTotal: number;
        ofensiva: number;
        mediaGeral: number;
    };
}

async function fetchHomeAluno(userId: string): Promise<HomeResponse> {
    return await api.get<HomeResponse>(`/aluno/home/${userId}`).then(res => res.data);
}

import { parseCookies } from "nookies";

export function useHomeAluno() {
    return useQuery<HomeResponse, Error>({
        queryKey: ['homeAluno'],
        queryFn: () => {
            const { '@BoraEntender:user': user } = parseCookies();
            if (!user) {
                throw new Error('Usuário não encontrado nos cookies');
            }
            const userId = JSON.parse(user).id;
            return fetchHomeAluno(userId);
        }
    })
}