import api from "@/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export interface PerfilAluno {
    id: number;
    nome: string;
    email: string;
    anoEscolar: string;
    nivelEnsino: string;
    DT_nascimento: string | null;
    criadoEm: string;
    planoAtivo: string | null;
    estatisticas: {
        totalConteudos: number;
        conteudosConcluidos: number;
        mediaGeral: number;
        ofensiva: number;
    };
}

export interface UpdatePerfilData {
    nome?: string;
    anoEscolar?: string;
    DT_nascimento?: string;
    senhaAtual?: string;
    novaSenha?: string;
}

import { parseCookies } from "nookies";

function getUserId(): string {
    const { '@BoraEntender:user': user } = parseCookies();
    if (!user) throw new Error('Usuário não encontrado');
    return JSON.parse(user).id;
}

async function fetchPerfil(): Promise<PerfilAluno> {
    const userId = getUserId();
    const res = await api.get<PerfilAluno>(`/aluno/perfil/${userId}`);
    return res.data;
}

async function updatePerfil(data: UpdatePerfilData): Promise<PerfilAluno> {
    const userId = getUserId();
    const res = await api.patch<PerfilAluno>(`/aluno/perfil/${userId}`, data);
    return res.data;
}

export function usePerfilAluno() {
    return useQuery<PerfilAluno, Error>({
        queryKey: ['perfilAluno'],
        queryFn: fetchPerfil,
    });
}

export function useAtualizarPerfil() {
    const queryClient = useQueryClient();

    return useMutation<PerfilAluno, Error, UpdatePerfilData>({
        mutationFn: updatePerfil,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['perfilAluno'] });
            queryClient.invalidateQueries({ queryKey: ['homeAluno'] });
        },
    });
}
