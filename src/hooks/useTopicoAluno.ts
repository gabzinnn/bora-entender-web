// ==========================================
// GET TOPICO ALUNO
// ==========================================

import api from "@/services/axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export type TipoConteudo = 'VIDEO' | 'PDF' | 'TEXTO' | 'QUIZ';

export interface TopicoAlunoResponse {
    id: number;
    moduloNumero: string;
    titulo: string;
    descricao: string | null;
    cor: string | null;
    materiaNome: string;
    materiaId: number;
    progresso: {
        percentual: number;
        atividadesConcluidas: number;
        atividadesTotais: number;
    };
    conteudos: ConteudoListItem[];
    conteudoAtual: ConteudoAtual | null;
}

export interface ConteudoListItem {
    id: number;
    titulo: string;
    tipo: TipoConteudo;
    duracao?: string;
    status: 'concluido' | 'atual' | 'bloqueado';
    questoes?: number;
}

export interface ConteudoAtual {
    id: number;
    titulo: string;
    tipo: TipoConteudo;
    paginaAtual: number;
    totalPaginas: number;
    concluido: boolean;
}

// ==========================================
// GET CONTEUDO
// ==========================================

export interface ConteudoResponse {
    id: number;
    titulo: string;
    tipo: TipoConteudo;
    ordem: number;
    tempoMin: number | null;
    video: VideoData | null;
    pdf: PDFData | null;
    texto: TextoData | null;
    quiz: QuizData | null;
}

export interface VideoData {
    id: number;
    conteudoId: number;
    url: string;
    duracao: number | null;
    resumoId: number | null;
    resumo: TextoData | null;
}

export interface PDFData {
    id: number;
    conteudoId: number;
    url: string;
    htmlUrl: string | null;
    possuiGabarito: boolean;
}

export interface TextoData {
    id: number;
    corpo: string;
    tempoLeitura: number | null;
    conteudoId: number | null;
}

export interface QuizData {
    id: number;
    conteudoId: number;
    questoes: QuestaoData[];
}

export interface QuestaoData {
    id: number;
    quizId: number;
    enunciado: string;
    imagens: ImagemData[];
    alternativas: AlternativaData[];
}

export interface AlternativaData {
    id: number;
    questaoId: number;
    texto: string;
    correta: boolean;
    justificativa: string | null;
    imagens: ImagemData[];
}

export interface ImagemData {
    id: number;
    url: string;
    legenda: string | null;
    questaoId: number | null;
    alternativaId: number | null;
}

// ==========================================
// GET DETALHES MATERIA FOR ALUNO
// ==========================================

export interface DetalhesMateriAlunoResponse {
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
    topicos: TopicoItem[];
}

export interface TopicoItem {
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

async function fetchTopicoAluno(idTopico: string, idAluno: string): Promise<TopicoAlunoResponse> {
    const response = await api.get(`/materia/${idTopico}/conteudo/aluno/${idAluno}`);
    return response.data;
}

async function fetchConteudo(idConteudo: string): Promise<ConteudoResponse> {
    const response = await api.get(`/materia/conteudo/${idConteudo}`);
    return response.data;
}

async function marcarConteudoConcluido(idConteudo: string, idAluno: string): Promise<void> {
    await api.patch(`/materia/conteudo/${idConteudo}/concluido/aluno/${idAluno}`);
}

async function concluirQuiz(idConteudo: string, idAluno: string, acertos: number, totalQuestoes: number): Promise<void> {
    await api.post(`/materia/conteudo/${idConteudo}/concluirQuiz/aluno/${idAluno}`, { acertos, totalQuestoes });
}

export function useTopicoAluno(idTopico: string, idAluno: string, enabled: boolean = true) {
    return useQuery<TopicoAlunoResponse, Error>({
        queryKey: ['topicoAluno', idTopico, idAluno],
        queryFn: () => fetchTopicoAluno(idTopico, idAluno),
        enabled,
    });
}

export function useConteudo(idConteudo: string, enabled: boolean = true) {
    return useQuery<ConteudoResponse, Error>({
        queryKey: ['conteudo', idConteudo],
        queryFn: () => fetchConteudo(idConteudo),
        enabled,
    });
}

export function useMarcarConteudoConcluido() {
    const queryClient = useQueryClient();
    return useMutation<void, Error, { idConteudo: string; idAluno: string }>({
        mutationFn: ({ idConteudo, idAluno }) => marcarConteudoConcluido(idConteudo, idAluno),
        onSuccess: (_, { idConteudo, idAluno }) => {
            // Invalidate queries to refetch updated data
            queryClient.invalidateQueries({ queryKey: ['topicoAluno', idAluno] });
            queryClient.invalidateQueries({ queryKey: ['conteudo', idConteudo] });
        },
    });
}

export function useConcluirQuiz() {
    return useMutation<void, Error, { idConteudo: string; idAluno: string; acertos: number; totalQuestoes: number }>({
        mutationFn: ({ idConteudo, idAluno, acertos, totalQuestoes }) => concluirQuiz(idConteudo, idAluno, acertos, totalQuestoes),
    });
}