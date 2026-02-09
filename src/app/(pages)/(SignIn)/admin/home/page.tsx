'use client';
import AdminSidebar from "@/app/components/AdminSidebar";
import { useAdminHome, DashboardResponse } from "@/hooks/useAdminHome";
import { Users, CreditCard, BookOpen, TrendingUp, TrendingDown, UserPlus, Loader2 } from "lucide-react";
import dynamic from "next/dynamic";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

function formatCentavos(centavos: number): string {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function formatVariacao(valor: number): string {
    const sinal = valor >= 0 ? '+' : '';
    return `${sinal}${valor}%`;
}

function timeAgo(dateStr: string): string {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'agora';
    if (diffMin < 60) return `${diffMin}m`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH < 24) return `${diffH}h`;
    const diffD = Math.floor(diffH / 24);
    return `${diffD}d`;
}

const statusConfig: Record<string, { label: string; color: string; bg: string; border: string }> = {
    ATIVA: { label: 'Ativa', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100' },
    PENDENTE: { label: 'Pendente', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-100' },
    CANCELADA: { label: 'Cancelada', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-100' },
    INADIMPLENTE: { label: 'Inadimplente', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-100' },
    EXPIRADA: { label: 'Expirada', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-100' },
};

interface MetricCardProps {
    title: string;
    value: string;
    variacao: number;
    icon: React.ReactNode;
    iconBg: string;
    iconColor: string;
}

function MetricCard({ title, value, variacao, icon, iconBg, iconColor }: MetricCardProps) {
    const isPositive = variacao >= 0;
    return (
        <div className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6">
            <div className="flex items-start justify-between">
                <div className={`flex h-10 w-10 items-center justify-center rounded-2xl ${iconBg} ${iconColor}`}>
                    {icon}
                </div>
                <span className={`flex items-center text-xs font-bold px-2.5 py-1 rounded-full ${
                    isPositive ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'
                }`}>
                    {formatVariacao(variacao)}
                </span>
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="text-2xl font-bold text-gray-900">{value}</p>
            </div>
        </div>
    );
}

function DashboardContent({ data }: { data: DashboardResponse }) {
    const { cards, graficoNovosAlunos, graficoReceita, atividades, distribuicaoPlanos } = data;

    const chartNovosAlunos: ApexCharts.ApexOptions = {
        chart: {
            type: 'area',
            toolbar: { show: false },
            fontFamily: 'inherit',
        },
        dataLabels: { enabled: false },
        stroke: { curve: 'smooth', width: 3 },
        colors: ['#00cdef'],
        fill: {
            type: 'gradient',
            gradient: {
                shadeIntensity: 1,
                opacityFrom: 0.3,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        xaxis: {
            categories: graficoNovosAlunos.map(i => {
                const d = new Date(i.data + 'T12:00:00');
                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }),
            labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tickAmount: 6,
        },
        yaxis: {
            labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
        },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        tooltip: {
            theme: 'light',
            y: { formatter: (val: number) => `${val} aluno(s)` },
        },
    };

    const chartReceita: ApexCharts.ApexOptions = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            fontFamily: 'inherit',
        },
        plotOptions: {
            bar: { borderRadius: 6, columnWidth: '60%' },
        },
        dataLabels: { enabled: false },
        colors: ['#ffd41c'],
        xaxis: {
            categories: graficoReceita.map(i => {
                const d = new Date(i.data + 'T12:00:00');
                return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
            }),
            labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
            tickAmount: 6,
        },
        yaxis: {
            labels: {
                style: { fontSize: '11px', colors: '#94a3b8' },
                formatter: (val: number) => formatCentavos(val),
            },
        },
        grid: { borderColor: '#f1f5f9', strokeDashArray: 4 },
        tooltip: {
            theme: 'light',
            y: { formatter: (val: number) => formatCentavos(val) },
        },
    };

    const totalNovosAlunos = graficoNovosAlunos.reduce((acc, i) => acc + i.quantidade, 0);

    return (
        <div className="flex-1 overflow-y-auto p-4 sm:p-8 bg-[#fafafa]">
            <div className="mx-auto flex max-w-350 flex-col gap-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">Visão Geral</h2>
                        <p className="mt-1 text-gray-500">Métricas e crescimento da plataforma</p>
                    </div>
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-green-600 bg-white px-3 py-1.5 rounded-2xl border border-gray-200">
                        <span className="block h-2 w-2 rounded-full bg-green-500"></span>
                        Sistema Online
                    </span>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total de Alunos"
                        value={cards.totalAlunos.toLocaleString('pt-BR')}
                        variacao={cards.variacaoAlunos}
                        icon={<Users size={20} />}
                        iconBg="bg-cyan-50"
                        iconColor="text-[#00cdef]"
                    />
                    <MetricCard
                        title="Assinaturas Ativas"
                        value={cards.assinaturasAtivas.toLocaleString('pt-BR')}
                        variacao={cards.variacaoAssinaturas}
                        icon={<UserPlus size={20} />}
                        iconBg="bg-green-50"
                        iconColor="text-green-600"
                    />
                    <MetricCard
                        title="Receita do Mês"
                        value={formatCentavos(cards.receitaMes)}
                        variacao={cards.variacaoReceita}
                        icon={<CreditCard size={20} />}
                        iconBg="bg-yellow-50"
                        iconColor="text-yellow-500"
                    />
                    <MetricCard
                        title="Conteúdos"
                        value={`${cards.totalConteudos}`}
                        variacao={0}
                        icon={<BookOpen size={20} />}
                        iconBg="bg-purple-50"
                        iconColor="text-purple-600"
                    />
                </div>

                {/* Charts + Activity */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Chart Area - Novos Alunos */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-2">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Novos Alunos</h3>
                            <p className="text-sm text-gray-500">Últimos 30 dias</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-bold text-gray-900">{totalNovosAlunos}</span>
                            <span className="text-sm font-medium text-gray-500">no período</span>
                        </div>
                        <div className="w-full min-h-70">
                            <Chart
                                options={chartNovosAlunos}
                                series={[{ name: 'Novos Alunos', data: graficoNovosAlunos.map(i => i.quantidade) }]}
                                type="area"
                                height={280}
                                width="100%"
                            />
                        </div>
                    </div>

                    {/* Atividades Recentes */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white lg:col-span-1">
                        <div className="border-b border-gray-200 p-6">
                            <h3 className="text-lg font-bold text-gray-900">Atividades Recentes</h3>
                            <p className="text-sm text-gray-500">Últimas assinaturas</p>
                        </div>
                        <div className="flex flex-col p-4 gap-1 overflow-y-auto max-h-105">
                            {atividades.length === 0 && (
                                <p className="text-sm text-gray-400 text-center py-8">Nenhuma atividade recente</p>
                            )}
                            {atividades.map((a) => {
                                const status = statusConfig[a.status] || statusConfig.PENDENTE;
                                const initials = a.nomeAluno.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
                                return (
                                    <div key={a.id} className="group flex gap-3 rounded-2xl p-3 transition-colors hover:bg-gray-50">
                                        <div className="mt-0.5 h-9 w-9 flex items-center justify-center rounded-full bg-gray-100 text-gray-600 text-xs font-bold shrink-0">
                                            {initials}
                                        </div>
                                        <div className="flex flex-1 flex-col gap-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2">
                                                <p className="text-sm font-bold text-gray-900 truncate">{a.nomeAluno}</p>
                                                <span className="text-xs text-gray-400 shrink-0">{timeAgo(a.data)}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 truncate">
                                                {a.status === 'ATIVA' && <>Assinou o <span className="font-bold text-[#00cdef]">{a.plano}</span></>}
                                                {a.status === 'CANCELADA' && <>Cancelou o <span className="font-bold text-red-500">{a.plano}</span></>}
                                                {a.status === 'PENDENTE' && <>Iniciou assinatura do <span className="font-bold text-yellow-600">{a.plano}</span></>}
                                                {a.status === 'INADIMPLENTE' && <>Inadimplente no <span className="font-bold text-orange-500">{a.plano}</span></>}
                                                {a.status === 'EXPIRADA' && <>Expirou o <span className="font-bold text-gray-500">{a.plano}</span></>}
                                            </p>
                                            <span className={`inline-flex items-center rounded-full w-fit px-2.5 py-0.5 text-[10px] font-bold border uppercase tracking-tighter ${status.color} ${status.bg} ${status.border}`}>
                                                {status.label}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Second Row: Receita Chart + Distribuição por Plano */}
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-2">
                        <div className="mb-6">
                            <h3 className="text-xl font-bold text-gray-900">Receita Diária</h3>
                            <p className="text-sm text-gray-500">Últimos 30 dias</p>
                        </div>
                        <div className="flex items-baseline gap-2 mb-4">
                            <span className="text-3xl font-bold text-gray-900">{formatCentavos(cards.receitaMes)}</span>
                            <span className="text-sm font-medium text-gray-500">no mês</span>
                        </div>
                        <div className="w-full min-h-70">
                            <Chart
                                options={chartReceita}
                                series={[{ name: 'Receita', data: graficoReceita.map(i => i.valor) }]}
                                type="bar"
                                height={280}
                                width="100%"
                            />
                        </div>
                    </div>

                    {/* Distribuição por Plano */}
                    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-6 sm:p-8 lg:col-span-1">
                        <div className="mb-6">
                            <h3 className="text-lg font-bold text-gray-900">Distribuição por Plano</h3>
                            <p className="text-sm text-gray-500">Assinaturas ativas</p>
                        </div>
                        {distribuicaoPlanos.length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-8">Nenhum dado disponível</p>
                        ) : (
                            <div className="flex flex-col gap-4">
                                {distribuicaoPlanos.map((p, idx) => {
                                    const total = distribuicaoPlanos.reduce((acc, i) => acc + i.quantidade, 0);
                                    const percent = total > 0 ? Math.round((p.quantidade / total) * 100) : 0;
                                    const colors = ['bg-[#00cdef]', 'bg-[#ffd41c]', 'bg-[#ff4d2e]', 'bg-purple-500', 'bg-green-500'];
                                    const color = colors[idx % colors.length];
                                    return (
                                        <div key={p.plano} className="flex flex-col gap-2">
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-semibold text-gray-700">{p.plano}</span>
                                                <span className="text-sm font-bold text-gray-900">{p.quantidade}</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                                                <div
                                                    className={`h-full rounded-full ${color} transition-all duration-500`}
                                                    style={{ width: `${percent}%` }}
                                                />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <span className="text-xs text-gray-400">{formatCentavos(p.preco)}/mês</span>
                                                <span className="text-xs text-gray-400">{percent}%</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* Quick Stats Bottom */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pb-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-[#00cdef]">
                            <BookOpen size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Matérias</p>
                            <p className="text-lg font-bold text-gray-900">{cards.totalMaterias}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600">
                            <TrendingUp size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Conversão</p>
                            <p className="text-lg font-bold text-gray-900">
                                {cards.totalAlunos > 0 ? Math.round((cards.assinaturasAtivas / cards.totalAlunos) * 100) : 0}%
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-50 text-yellow-500">
                            <CreditCard size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Ticket Médio</p>
                            <p className="text-lg font-bold text-gray-900">
                                {cards.assinaturasAtivas > 0 ? formatCentavos(Math.round(cards.receitaMes / cards.assinaturasAtivas)) : 'R$ 0'}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500">
                            <TrendingDown size={18} />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">Conteúdos</p>
                            <p className="text-lg font-bold text-gray-900">{cards.totalConteudos}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function AdminHome() {
    const { data, isLoading, isError } = useAdminHome();

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                {isLoading && (
                    <div className="flex-1 flex items-center justify-center">
                        <Loader2 size={40} className="animate-spin text-[#00cdef]" />
                    </div>
                )}
                {isError && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-800 mb-2">Erro ao carregar dashboard</p>
                            <p className="text-sm text-gray-500">Tente novamente mais tarde.</p>
                        </div>
                    </div>
                )}
                {data && <DashboardContent data={data} />}
            </main>
        </div>
    );
}