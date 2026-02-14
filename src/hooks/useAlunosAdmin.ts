import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

export interface AlunoAdmin {
    id: number;
    usuarioId: number;
    nome: string;
    email: string;
    anoEscolar: string;
    nivelEnsino: 'EF' | 'EM' | 'SUPERIOR';
    DT_nascimento: string | null;
    criadoEm: string;
    planoAtivo: string | null;
    totalProgressos: number;
    status: 'ATIVO' | 'INATIVO';
}

export interface ListarAlunosResponse {
    data: AlunoAdmin[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

interface ListarAlunosParams {
    page: number;
    perPage: number;
    search?: string;
    nivelEnsino?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

async function fetchAlunos(params: ListarAlunosParams): Promise<ListarAlunosResponse> {
    const query = new URLSearchParams();
    query.set('page', String(params.page));
    query.set('perPage', String(params.perPage));
    if (params.search) query.set('search', params.search);
    if (params.nivelEnsino) query.set('nivelEnsino', params.nivelEnsino);
    if (params.sortField) query.set('sortField', params.sortField);
    if (params.sortDirection) query.set('sortDirection', params.sortDirection);

    const res = await api.get<ListarAlunosResponse>(`/admin/alunos?${query.toString()}`);
    return res.data;
}

export function useAlunosAdmin(params: ListarAlunosParams) {
    return useQuery<ListarAlunosResponse, Error>({
        queryKey: ['adminAlunos', params],
        queryFn: () => fetchAlunos(params),
        placeholderData: (prev) => prev,
    });
}
