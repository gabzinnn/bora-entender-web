'use client';

import { useState, useCallback, useMemo } from 'react';
import AdminSidebar from "@/app/components/AdminSidebar";
import { AdminHeader } from "@/app/components/AdminHeader";
import LoadingScreen from "@/app/components/LoadingScreen";
import { useFinanceiroAdmin, type TransacaoAdmin, type FinanceiroResponse } from "@/hooks/useFinanceiroAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, Search, X, CreditCard, QrCode, Banknote, Receipt, Users, UserMinus, BarChart3 } from 'lucide-react';
import dynamic from 'next/dynamic';

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// === Helpers ===

function formatCentavos(centavos: number): string {
    return (centavos / 100).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function getInitials(name: string): string {
    return name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
}

// === Status Config ===

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
    PAGO: { label: 'PAGO', color: 'text-green-700', bg: 'bg-green-100' },
    FALHOU: { label: 'FALHOU', color: 'text-red-600', bg: 'bg-red-100' },
    PENDENTE: { label: 'PENDENTE', color: 'text-yellow-700', bg: 'bg-yellow-100' },
    CANCELADO: { label: 'CANCELADO', color: 'text-gray-600', bg: 'bg-gray-100' },
    EXPIRADO: { label: 'EXPIRADO', color: 'text-orange-600', bg: 'bg-orange-100' },
};

// === Metric Card ===

interface MetricCardProps {
    title: string;
    value: string;
    variacao: number;
    variacaoLabel: string;
    accentColor: string;
    accentBg: string;
    icon: React.ReactNode;
}

function MetricCard({ title, value, variacao, variacaoLabel, accentColor, accentBg, icon }: MetricCardProps) {
    const isPositive = variacao >= 0;
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-200 relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-16 h-16 ${accentBg} rounded-bl-full`} />
            <div className="flex items-center gap-3 mb-2">
                <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${accentBg} ${accentColor}`}>
                    {icon}
                </div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
            </div>
            <p className={`text-3xl font-bold ${accentColor}`}>{value}</p>
            <div className="mt-3 flex items-center gap-2">
                <span className={`text-xs font-bold flex items-center gap-0.5 ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                    {isPositive ? '+' : ''}{variacao}%
                </span>
                <span className="text-gray-400 text-[10px]">{variacaoLabel}</span>
            </div>
        </div>
    );
}

// === Table Styles ===

const customStyles = {
    table: { style: { backgroundColor: 'white' } },
    headRow: {
        style: {
            backgroundColor: '#f9fafb',
            borderBottomWidth: '1px',
            borderBottomColor: '#e5e7eb',
            minHeight: '52px',
        },
    },
    headCells: {
        style: {
            fontSize: '0.7rem',
            fontWeight: '700',
            color: '#6b7280',
            textTransform: 'uppercase' as const,
            letterSpacing: '0.05em',
            paddingLeft: '24px',
            paddingRight: '24px',
        },
    },
    rows: {
        style: {
            minHeight: '64px',
            fontSize: '0.875rem',
            '&:hover': { backgroundColor: '#f0fdfa' },
        },
    },
    cells: { style: { paddingLeft: '24px', paddingRight: '24px' } },
    pagination: {
        style: {
            borderTopWidth: '1px',
            borderTopColor: '#e5e7eb',
            backgroundColor: 'white',
            minHeight: '56px',
        },
    },
};

const paginationComponentOptions = {
    rowsPerPageText: 'Por página:',
    rangeSeparatorText: 'de',
    noRowsPerPage: false,
    selectAllRowsItem: false,
};

// === Main Content ===

function FinanceiroContent({ data, searchInput, setSearchInput, statusFiltro, setStatusFiltro, page, setPage, perPage, setPerPage, sortField, setSortField, sortDirection, setSortDirection, isLoading, isFetching }: {
    data: FinanceiroResponse;
    searchInput: string;
    setSearchInput: (v: string) => void;
    statusFiltro: string;
    setStatusFiltro: (v: string) => void;
    page: number;
    setPage: (v: number) => void;
    perPage: number;
    setPerPage: (v: number) => void;
    sortField: string;
    setSortField: (v: string) => void;
    sortDirection: 'asc' | 'desc';
    setSortDirection: (v: 'asc' | 'desc') => void;
    isLoading: boolean;
    isFetching: boolean;
}) {
    const { cards, graficoMrr, transacoes, resumo } = data;

    // === Chart Config ===
    const chartMrr: ApexCharts.ApexOptions = {
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
                opacityFrom: 0.35,
                opacityTo: 0.05,
                stops: [0, 100],
            },
        },
        xaxis: {
            categories: graficoMrr.map(i => i.mes),
            labels: { style: { fontSize: '11px', colors: '#94a3b8' } },
            axisBorder: { show: false },
            axisTicks: { show: false },
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
        markers: {
            size: 5,
            colors: ['#00cdef'],
            strokeColors: '#fff',
            strokeWidth: 2,
            hover: { size: 7 },
        },
    };

    // === Table Columns ===
    const columns: TableColumn<TransacaoAdmin>[] = useMemo(() => [
        {
            name: 'Aluno',
            sortable: true,
            sortField: 'nome',
            grow: 2,
            cell: (row: TransacaoAdmin) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="size-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-[#00cdef] text-xs shrink-0">
                        {getInitials(row.nomeAluno)}
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-sm font-semibold text-gray-800 truncate">{row.nomeAluno}</span>
                        <span className="text-[11px] text-gray-400 truncate">{row.emailAluno}</span>
                    </div>
                </div>
            ),
        },
        {
            name: 'Plano',
            width: '160px',
            cell: (row: TransacaoAdmin) => (
                <span className="text-sm text-gray-500">{row.plano}</span>
            ),
        },
        {
            name: 'Valor',
            sortable: true,
            sortField: 'valor',
            width: '140px',
            cell: (row: TransacaoAdmin) => (
                <span className="text-sm font-bold text-gray-800">{formatCentavos(row.valor)}</span>
            ),
        },
        {
            name: 'Método',
            width: '120px',
            cell: (row: TransacaoAdmin) => (
                <div className="flex items-center gap-1.5">
                    {row.metodoPagamento === 'PIX' ? (
                        <QrCode size={14} className="text-[#00cdef]" />
                    ) : (
                        <CreditCard size={14} className="text-purple-500" />
                    )}
                    <span className="text-xs font-semibold text-gray-600">
                        {row.metodoPagamento === 'PIX' ? 'PIX' : 'Cartão'}
                    </span>
                </div>
            ),
        },
        {
            name: 'Data',
            sortable: true,
            sortField: 'createdAt',
            width: '140px',
            cell: (row: TransacaoAdmin) => (
                <span className="text-sm text-gray-500">
                    {new Date(row.createdAt).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </span>
            ),
        },
        {
            name: 'Status',
            sortable: true,
            sortField: 'status',
            width: '130px',
            cell: (row: TransacaoAdmin) => {
                const cfg = statusConfig[row.status] || statusConfig.PENDENTE;
                return (
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
                        {cfg.label}
                    </span>
                );
            },
        },
    ], []);

    const handlePageChange = useCallback((p: number) => setPage(p), [setPage]);
    const handlePerRowsChange = useCallback((newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(1);
    }, [setPerPage, setPage]);

    const handleSort = useCallback((column: TableColumn<TransacaoAdmin>, direction: SortOrder) => {
        setSortField(column.sortField || 'createdAt');
        setSortDirection(direction);
        setPage(1);
    }, [setSortField, setSortDirection, setPage]);

    const handleSearchChange = useCallback((value: string) => {
        setSearchInput(value);
        setPage(1);
    }, [setSearchInput, setPage]);

    const handleLimparFiltros = () => {
        setSearchInput('');
        setStatusFiltro('');
        setPage(1);
        setSortField('createdAt');
        setSortDirection('desc');
    };

    const hasFilters = !!searchInput || !!statusFiltro;

    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary">
            <AdminHeader
                title="Painel Financeiro"
                subtitle="Acompanhe receitas, conversões e transações da plataforma"
                showSearch={false}
                showUserProfile={true}
            />

            <div className="p-4 md:p-6 lg:p-8 space-y-6">
                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <MetricCard
                        title="MRR Total"
                        value={formatCentavos(cards.mrr)}
                        variacao={cards.variacaoMrr}
                        variacaoLabel="vs. mês anterior"
                        accentColor="text-yellow-500"
                        accentBg="bg-yellow-50"
                        icon={<DollarSign size={18} />}
                    />
                    <MetricCard
                        title="Taxa de Conversão"
                        value={`${cards.taxaConversao}%`}
                        variacao={cards.variacaoConversao}
                        variacaoLabel="taxa de fechamento"
                        accentColor="text-[#00cdef]"
                        accentBg="bg-cyan-50"
                        icon={<TrendingUp size={18} />}
                    />
                    <MetricCard
                        title="Pagamentos com Falha"
                        value={String(cards.pagamentosFalha)}
                        variacao={cards.variacaoFalha}
                        variacaoLabel="requer atenção"
                        accentColor="text-red-500"
                        accentBg="bg-red-50"
                        icon={<AlertTriangle size={18} />}
                    />
                </div>

                {/* Resumo Financeiro */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-600 shrink-0">
                            <Banknote size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Receita Total</p>
                            <p className="text-base font-bold text-gray-900 truncate">{formatCentavos(resumo.receitaTotal)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-50 text-[#00cdef] shrink-0">
                            <BarChart3 size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Receita do Mês</p>
                            <p className="text-base font-bold text-gray-900 truncate">{formatCentavos(resumo.receitaMesAtual)}</p>
                            <span className={`text-[10px] font-bold ${resumo.variacaoReceitaMes >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                                {resumo.variacaoReceitaMes >= 0 ? '+' : ''}{resumo.variacaoReceitaMes}%
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 shrink-0">
                            <CreditCard size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Ticket Médio</p>
                            <p className="text-base font-bold text-gray-900 truncate">{formatCentavos(resumo.ticketMedio)}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shrink-0">
                            <Receipt size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Pagamentos</p>
                            <p className="text-base font-bold text-gray-900">{resumo.totalPagamentos}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 shrink-0">
                            <Users size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Assinantes Ativos</p>
                            <p className="text-base font-bold text-gray-900">{resumo.assinaturasAtivas}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 rounded-2xl border border-gray-200 bg-white p-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-500 shrink-0">
                            <UserMinus size={18} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[11px] text-gray-400 font-medium">Churn Rate</p>
                            <p className="text-base font-bold text-gray-900">{resumo.churnRate}%</p>
                            <span className="text-[10px] text-gray-400">{resumo.assinaturasCanceladas} canceladas</span>
                        </div>
                    </div>
                </div>

                {/* Chart - Receita ao Longo do Tempo */}
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-lg font-bold text-gray-900">Receita ao Longo do Tempo</h3>
                            <p className="text-xs text-gray-500">Variação de receita nos últimos 6 meses</p>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="size-2 rounded-full bg-[#00cdef]" />
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Receita Mensal</span>
                        </div>
                    </div>
                    <div className="w-full min-h-70">
                        <Chart
                            options={chartMrr}
                            series={[{ name: 'Receita', data: graficoMrr.map(i => i.valor) }]}
                            type="area"
                            height={280}
                            width="100%"
                        />
                    </div>
                </div>

                {/* Transações */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
                    {/* Header + Filters */}
                    <div className="px-6 py-5 border-b border-gray-100">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Transações Recentes</h3>
                            {isFetching && !isLoading && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="size-3 border-2 border-[#00cdef] border-t-transparent rounded-full animate-spin" />
                                    Atualizando...
                                </div>
                            )}
                        </div>
                        <div className="flex flex-wrap items-end gap-4">
                            {/* Search */}
                            <div className="flex flex-col flex-1 min-w-60">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                    Buscar Aluno
                                </label>
                                <div className="relative group">
                                    <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#00cdef] transition-colors" />
                                    <input
                                        type="text"
                                        value={searchInput}
                                        onChange={(e) => handleSearchChange(e.target.value)}
                                        placeholder="Nome ou email..."
                                        className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#00cdef]/50 text-sm outline-none"
                                    />
                                    {searchInput && (
                                        <button
                                            onClick={() => handleSearchChange('')}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* Status Filter */}
                            <div className="flex flex-col w-48">
                                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                    Status
                                </label>
                                <select
                                    value={statusFiltro}
                                    onChange={(e) => { setStatusFiltro(e.target.value); setPage(1); }}
                                    className="w-full py-3 px-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-[#00cdef]/50 text-sm outline-none cursor-pointer"
                                >
                                    <option value="">Todos</option>
                                    <option value="PAGO">Pago</option>
                                    <option value="FALHOU">Falhou</option>
                                    <option value="PENDENTE">Pendente</option>
                                    <option value="CANCELADO">Cancelado</option>
                                    <option value="EXPIRADO">Expirado</option>
                                </select>
                            </div>

                            {/* Clear */}
                            {hasFilters && (
                                <button
                                    onClick={handleLimparFiltros}
                                    className="px-5 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors cursor-pointer"
                                >
                                    Limpar Filtros
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="flex items-center justify-between px-6 py-3 bg-gray-50/50">
                        <div className="flex items-center gap-2 text-sm">
                            <DollarSign size={16} className="text-gray-400" />
                            <span className="text-gray-500 font-medium">Total:</span>
                            <span className="font-bold text-gray-800">{transacoes.total} transações</span>
                        </div>
                    </div>

                    {/* Table */}
                    <DataTable
                        columns={columns}
                        data={transacoes.data}
                        progressPending={isLoading}
                        progressComponent={
                            <div className="flex items-center justify-center py-16">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="size-10 border-4 border-[#00cdef] border-t-transparent rounded-full animate-spin" />
                                    <span className="text-sm text-gray-400">Carregando transações...</span>
                                </div>
                            </div>
                        }
                        noDataComponent={
                            <div className="flex flex-col items-center justify-center py-16 text-center">
                                <DollarSign size={48} className="text-gray-300 mb-4" />
                                <h3 className="text-lg font-bold text-gray-600 mb-1">Nenhuma transação encontrada</h3>
                                <p className="text-sm text-gray-400 max-w-sm">
                                    {hasFilters
                                        ? 'Tente alterar os filtros ou buscar por outro termo.'
                                        : 'Ainda não há transações registradas.'
                                    }
                                </p>
                            </div>
                        }
                        pagination
                        paginationServer
                        paginationTotalRows={transacoes.total}
                        paginationDefaultPage={page}
                        paginationPerPage={perPage}
                        paginationRowsPerPageOptions={[10, 20, 30, 50]}
                        paginationComponentOptions={paginationComponentOptions}
                        onChangePage={handlePageChange}
                        onChangeRowsPerPage={handlePerRowsChange}
                        sortServer
                        onSort={handleSort}
                        defaultSortFieldId="createdAt"
                        defaultSortAsc={false}
                        customStyles={customStyles}
                        highlightOnHover
                        pointerOnHover={false}
                        responsive
                        dense={false}
                    />
                </div>
            </div>
        </div>
    );
}

// === Page Component ===

export default function FinanceiroAdmin() {
    const [searchInput, setSearchInput] = useState('');
    const [statusFiltro, setStatusFiltro] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const debouncedSearch = useDebounce(searchInput, 400);

    const { data, isLoading, isError, isFetching } = useFinanceiroAdmin({
        page,
        perPage,
        search: debouncedSearch || undefined,
        status: statusFiltro || undefined,
        sortField,
        sortDirection,
    });

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                {isLoading && <LoadingScreen />}
                {isError && (
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <p className="text-lg font-bold text-gray-800 mb-2">Erro ao carregar painel financeiro</p>
                            <p className="text-sm text-gray-500">Tente novamente mais tarde.</p>
                        </div>
                    </div>
                )}
                {data && (
                    <FinanceiroContent
                        data={data}
                        searchInput={searchInput}
                        setSearchInput={setSearchInput}
                        statusFiltro={statusFiltro}
                        setStatusFiltro={setStatusFiltro}
                        page={page}
                        setPage={setPage}
                        perPage={perPage}
                        setPerPage={setPerPage}
                        sortField={sortField}
                        setSortField={setSortField}
                        sortDirection={sortDirection}
                        setSortDirection={setSortDirection}
                        isLoading={isLoading}
                        isFetching={isFetching}
                    />
                )}
            </main>
        </div>
    );
}
