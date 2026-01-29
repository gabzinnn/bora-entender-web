import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

interface Topico {
    id: number;
    moduloNumero: string;
    titulo: string;
    descricao: string | null;
    ordem: number;
    status: 'concluido' | 'em-andamento' | 'bloqueado';
    percentual: number;
    duracao: string;
    tempoRestante: string;
    conteudosTotais: number;
    conteudosConcluidos: number;
}

interface MateriaDetalhes {
    id: number;
    nome: string;
    descricao: string | null;
    cor: string | null;
    icone: string | null;
    progresso: {
        percentual: number;
        modulosConcluidos: number;
        modulosTotais: number;
        horasEstudadas: number;
    };
    topicos: Topico[];
}

async function fetchMateriaAluno(materiaId: string): Promise<MateriaDetalhes> {
    const alunoId = JSON.parse(localStorage.getItem('@BoraEntender:user') || '{}').id;
    const materia = await api.get<MateriaDetalhes>(`/materia/${materiaId}/aluno/${alunoId}`);
    return materia.data;
}

export function useMateriaAluno(materiaId: string, enabled: boolean = true) {
    return useQuery<MateriaDetalhes, Error>({
        queryKey: ['materiaAluno', materiaId],
        queryFn: () => fetchMateriaAluno(materiaId),
        enabled,
    });
}