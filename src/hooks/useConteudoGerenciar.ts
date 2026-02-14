import api from "@/services/axios";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

// ─── Types ──────────────────────────────────────────────────────────────────

export type TipoConteudo = 'VIDEO' | 'PDF' | 'QUIZ' | 'TEXTO';

export type AlternativaDetalhe = {
    id: number;
    texto: string;
    correta: boolean;
    justificativa: string | null;
    imagens: Array<{ id: number; url: string; legenda: string | null }>;
};

export type QuestaoDetalhe = {
    id: number;
    enunciado: string;
    imagens: Array<{ id: number; url: string; legenda: string | null }>;
    alternativas: AlternativaDetalhe[];
};

export type VideoDetalhe = {
    id: number;
    url: string;
    duracao: number | null;
    resumoId: number | null;
    resumo: { id: number; corpo: string; tempoLeitura: number | null } | null;
};

export type PdfDetalhe = {
    id: number;
    url: string;
    htmlUrl: string | null;
    possuiGabarito: boolean;
};

export type TextoDetalhe = {
    id: number;
    corpo: string;
    tempoLeitura: number | null;
};

export type QuizDetalhe = {
    id: number;
    questoes: QuestaoDetalhe[];
};

export type ConteudoDetalhe = {
    id: number;
    titulo: string;
    tipo: TipoConteudo;
    ordem: number;
    tempoMin: number | null;
    criadoEm: string;
    topico: {
        id: number;
        titulo: string;
        materiaId: number;
        materia: {
            id: number;
            nome: string;
            cor: string | null;
            icone: string | null;
        };
    };
    video: VideoDetalhe | null;
    pdf: PdfDetalhe | null;
    texto: TextoDetalhe | null;
    quiz: QuizDetalhe | null;
};

export type SalvarDadosPayload = {
    titulo?: string;
    tempoMin?: number;
    // Video
    videoUrl?: string;
    videoDuracao?: number;
    videoResumo?: string;
    // PDF
    pdfUrl?: string;
    possuiGabarito?: boolean;
    // Texto
    corpo?: string;
    tempoLeitura?: number;
    // Quiz
    questoes?: Array<{
        enunciado: string;
        alternativas: Array<{
            texto: string;
            correta: boolean;
            justificativa?: string;
        }>;
    }>;
};

// ─── API calls ──────────────────────────────────────────────────────────────

async function fetchConteudoDetalhe(id: number): Promise<ConteudoDetalhe> {
    const res = await api.get(`/materia/admin/conteudo/${id}/detalhe`);
    return res.data;
}

async function salvarDados(id: number, dados: SalvarDadosPayload): Promise<ConteudoDetalhe> {
    const res = await api.patch(`/materia/admin/conteudo/${id}/dados`, dados);
    return res.data;
}

async function uploadArquivo(
    file: File,
    pasta: string = 'geral',
    onProgress?: (percent: number) => void,
): Promise<{ url: string; path: string; htmlContent?: string }> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('pasta', pasta);
    const res = await api.post('/materia/admin/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        timeout: 0, // sem timeout para uploads grandes
        onUploadProgress: (e) => {
            if (e.total && onProgress) {
                onProgress(Math.round((e.loaded * 100) / e.total));
            }
        },
    });
    return res.data;
}

// ─── Hook principal ─────────────────────────────────────────────────────────

export default function useConteudoGerenciar(conteudoId: number) {
    const queryClient = useQueryClient();
    const queryKey = ['conteudoDetalhe', conteudoId];

    const query = useQuery({
        queryKey,
        queryFn: () => fetchConteudoDetalhe(conteudoId),
        staleTime: 1000 * 60 * 2,
        enabled: !!conteudoId && conteudoId > 0,
    });

    const invalidate = () => queryClient.invalidateQueries({ queryKey });

    // Salvar dados do conteúdo
    const salvarMutation = useMutation({
        mutationFn: (dados: SalvarDadosPayload) => salvarDados(conteudoId, dados),
        onSuccess: (data) => {
            queryClient.setQueryData(queryKey, data);
        },
    });

    // Upload de arquivo
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);

    const uploadMutation = useMutation({
        mutationFn: ({ file, pasta }: { file: File; pasta?: string }) =>
            uploadArquivo(file, pasta, (p) => setUploadProgress(p)),
        onSettled: () => setUploadProgress(null),
    });

    return {
        ...query,
        salvar: salvarMutation,
        upload: uploadMutation,
        uploadProgress,
        invalidate,
    };
}
