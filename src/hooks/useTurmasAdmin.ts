import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

export interface TurmaAdmin {
    id: number;
    nome: string;
    descricao: string | null;
    createdAt: string;
    _count: { alunos: number };
}

async function fetchTurmas(): Promise<TurmaAdmin[]> {
    const res = await api.get<TurmaAdmin[]>('/turma');
    return res.data;
}

export function useTurmasAdmin() {
    return useQuery<TurmaAdmin[], Error>({
        queryKey: ['turmasAdmin'],
        queryFn: fetchTurmas,
    });
}

export interface AlunoTurma {
    id: number;
    nome: string;
    email: string;
}

async function fetchAlunosDaTurma(turmaId: number): Promise<AlunoTurma[]> {
    const res = await api.get<AlunoTurma[]>(`/turma/${turmaId}/alunos`);
    return res.data;
}

export function useAlunosDaTurma(turmaId: number | null) {
    return useQuery<AlunoTurma[], Error>({
        queryKey: ['turmaAlunos', turmaId],
        queryFn: () => fetchAlunosDaTurma(turmaId as number),
        enabled: turmaId != null,
    });
}
