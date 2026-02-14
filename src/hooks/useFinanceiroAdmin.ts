import api from "@/services/axios";
import { useQuery, keepPreviousData } from "@tanstack/react-query";

// === Types ===

interface FinanceiroCards {
    mrr: number; // centavos
    variacaoMrr: number;
    taxaConversao: number;
    variacaoConversao: number;
    pagamentosFalha: number;
    variacaoFalha: number;
}

interface GraficoMrrItem {
    mes: string;
    valor: number; // centavos
}

export interface TransacaoAdmin {
    id: number;
    nomeAluno: string;
    emailAluno: string;
    plano: string;
    valor: number; // centavos
    metodoPagamento: 'CARTAO' | 'PIX';
    status: 'PENDENTE' | 'PAGO' | 'FALHOU' | 'CANCELADO' | 'EXPIRADO';
    createdAt: string;
    paidAt: string | null;
}

interface TransacoesPaginated {
    data: TransacaoAdmin[];
    total: number;
    page: number;
    perPage: number;
    totalPages: number;
}

interface DistribuicaoMetodo {
    metodo: 'CARTAO' | 'PIX';
    quantidade: number;
    valorTotal: number;
}

interface FinanceiroResumo {
    receitaTotal: number;
    receitaMesAtual: number;
    variacaoReceitaMes: number;
    ticketMedio: number;
    totalPagamentos: number;
    assinaturasAtivas: number;
    assinaturasCanceladas: number;
    churnRate: number;
}

export interface FinanceiroResponse {
    cards: FinanceiroCards;
    resumo: FinanceiroResumo;
    graficoMrr: GraficoMrrItem[];
    transacoes: TransacoesPaginated;
    distribuicaoMetodo: DistribuicaoMetodo[];
}

interface UseFinanceiroParams {
    page?: number;
    perPage?: number;
    search?: string;
    status?: string;
    sortField?: string;
    sortDirection?: 'asc' | 'desc';
}

async function fetchFinanceiro(params: UseFinanceiroParams): Promise<FinanceiroResponse> {
    const { data } = await api.get<FinanceiroResponse>('/admin/financeiro', { params });
    return data;
}

export function useFinanceiroAdmin(params: UseFinanceiroParams = {}) {
    return useQuery<FinanceiroResponse, Error>({
        queryKey: ['adminFinanceiro', params],
        queryFn: () => fetchFinanceiro(params),
        placeholderData: keepPreviousData,
        refetchInterval: 60000,
    });
}
