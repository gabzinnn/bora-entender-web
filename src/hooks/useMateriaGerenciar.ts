import api from "@/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

// ─── Types ──────────────────────────────────────────────────────────────────

export type ConteudoResumo = {
    id: number;
    titulo: string;
    tipo: 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXTO';
    ordem: number;
    tempoMin: number | null;
};

export type TopicoGerenciar = {
    id: number;
    titulo: string;
    descricao: string | null;
    ordem: number;
    duracaoMin: number;
    totalConteudos: number;
    totalAulas: number;
    totalQuiz: number;
    conteudos: ConteudoResumo[];
};

export type MateriaGerenciar = {
    id: number;
    nome: string;
    descricao: string | null;
    cor: string | null;
    icone: string | null;
    topicos: TopicoGerenciar[];
};

// ─── API calls ──────────────────────────────────────────────────────────────

async function fetchMateriaGerenciar(id: number): Promise<MateriaGerenciar> {
    const res = await api.get(`/materia/admin/${id}`);
    return res.data;
}

// ─── Hook principal ─────────────────────────────────────────────────────────

export default function useMateriaGerenciar(materiaId: number) {
    const queryClient = useQueryClient();
    const queryKey = ['materiaGerenciar', materiaId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchMateriaGerenciar(materiaId),
        staleTime: 1000 * 60 * 3,
        enabled: !!materiaId,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    // Criar tópico
    const criarTopicoMutation = useMutation({
        mutationFn: (data: { titulo: string; descricao?: string }) =>
            api.post(`/materia/admin/${materiaId}/topico`, data),
        onSuccess: invalidate,
    });

    // Atualizar tópico
    const atualizarTopicoMutation = useMutation({
        mutationFn: ({ topicoId, data }: { topicoId: number; data: { titulo?: string; descricao?: string; duracaoMin?: number } }) =>
            api.patch(`/materia/admin/topico/${topicoId}`, data),
        onSuccess: invalidate,
    });

    // Deletar tópico
    const deletarTopicoMutation = useMutation({
        mutationFn: (topicoId: number) =>
            api.delete(`/materia/admin/topico/${topicoId}`),
        onSuccess: invalidate,
    });

    // Reordenar tópicos
    const reordenarTopicosMutation = useMutation({
        mutationFn: (topicoIds: number[]) =>
            api.patch(`/materia/admin/${materiaId}/topicos/reordenar`, { topicoIds }),
        onSuccess: invalidate,
    });

    // ─── Conteúdo CRUD ──────────────────────────────────────────────────────

    // Criar conteúdo
    const criarConteudoMutation = useMutation({
        mutationFn: ({ topicoId, data }: { topicoId: number; data: { titulo: string; tipo: 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXTO'; tempoMin?: number } }) =>
            api.post(`/materia/admin/topico/${topicoId}/conteudo`, data),
        onSuccess: invalidate,
    });

    // Atualizar conteúdo
    const atualizarConteudoMutation = useMutation({
        mutationFn: ({ conteudoId, data }: { conteudoId: number; data: { titulo?: string; tipo?: 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXTO'; tempoMin?: number } }) =>
            api.patch(`/materia/admin/conteudo/${conteudoId}`, data),
        onSuccess: invalidate,
    });

    // Deletar conteúdo
    const deletarConteudoMutation = useMutation({
        mutationFn: (conteudoId: number) =>
            api.delete(`/materia/admin/conteudo/${conteudoId}`),
        onSuccess: invalidate,
    });

    // Reordenar conteúdos
    const reordenarConteudosMutation = useMutation({
        mutationFn: ({ topicoId, conteudoIds }: { topicoId: number; conteudoIds: number[] }) =>
            api.patch(`/materia/admin/topico/${topicoId}/conteudos/reordenar`, { conteudoIds }),
        onSuccess: invalidate,
    });

    return {
        ...query,
        criarTopico: criarTopicoMutation,
        atualizarTopico: atualizarTopicoMutation,
        deletarTopico: deletarTopicoMutation,
        reordenarTopicos: reordenarTopicosMutation,
        criarConteudo: criarConteudoMutation,
        atualizarConteudo: atualizarConteudoMutation,
        deletarConteudo: deletarConteudoMutation,
        reordenarConteudos: reordenarConteudosMutation,
    };
}
