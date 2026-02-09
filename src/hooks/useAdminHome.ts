import api from "@/services/axios";
import { useQuery } from "@tanstack/react-query";

interface CardMetrics {
    totalAlunos: number;
    variacaoAlunos: number;
    assinaturasAtivas: number;
    variacaoAssinaturas: number;
    receitaMes: number; // centavos
    variacaoReceita: number;
    totalConteudos: number;
    totalMaterias: number;
}

interface GraficoItem {
    data: string;
    quantidade: number;
}

interface GraficoReceitaItem {
    data: string;
    valor: number; // centavos
}

interface Atividade {
    id: number;
    nomeAluno: string;
    emailAluno: string;
    plano: string;
    precoPlano: number;
    status: 'PENDENTE' | 'ATIVA' | 'CANCELADA' | 'INADIMPLENTE' | 'EXPIRADA';
    data: string;
}

interface DistribuicaoPlano {
    plano: string;
    preco: number;
    quantidade: number;
}

export interface DashboardResponse {
    cards: CardMetrics;
    graficoNovosAlunos: GraficoItem[];
    graficoReceita: GraficoReceitaItem[];
    atividades: Atividade[];
    distribuicaoPlanos: DistribuicaoPlano[];
}

async function fetchDashboard(): Promise<DashboardResponse> {
    return await api.get<DashboardResponse>('/admin/dashboard').then(res => res.data);
}

export function useAdminHome() {
    return useQuery<DashboardResponse, Error>({
        queryKey: ['adminDashboard'],
        queryFn: fetchDashboard,
        refetchInterval: 60000, // Atualiza a cada 1 minuto
    });
}
