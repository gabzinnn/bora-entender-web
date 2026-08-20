import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

export interface AulaAdmin {
    id: number;
    turmaId: number;
    data: string;
    titulo: string | null;
    createdAt: string;
    totalPresentes: number;
}

async function fetchAulas(turmaId: number): Promise<AulaAdmin[]> {
    const res = await api.get<AulaAdmin[]>(`/aula?turmaId=${turmaId}`);
    return res.data;
}

export function useAulasAdmin(turmaId: number | null) {
    return useQuery<AulaAdmin[], Error>({
        queryKey: ['aulasAdmin', turmaId],
        queryFn: () => fetchAulas(turmaId as number),
        enabled: turmaId != null,
    });
}
