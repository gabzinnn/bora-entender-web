'use client';

import { useState, useCallback, useMemo } from 'react';
import AdminSidebar from "@/app/components/AdminSidebar";
import { AdminHeader } from "@/app/components/AdminHeader";
import { useAlunosAdmin, type AlunoAdmin } from "@/hooks/useAlunosAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import DataTable, { type TableColumn, type SortOrder } from 'react-data-table-component';
import { Users, Search, X, Trash2, AlertTriangle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/services/axios';

const NIVEL_LABELS: Record<string, string> = {
    EF: 'Fundamental',
    EM: 'Ensino Médio',
    SUPERIOR: 'Superior',
};

function NivelBadge({ nivel }: { nivel: string }) {
    return (
        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg text-xs font-semibold whitespace-nowrap">
            {NIVEL_LABELS[nivel] || nivel}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const isAtivo = status === 'ATIVO';
    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-tight ${
            isAtivo 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-500'
        }`}>
            <span className={`size-1.5 rounded-full ${isAtivo ? 'bg-green-600' : 'bg-gray-400'}`} />
            {isAtivo ? 'Ativo' : 'Inativo'}
        </span>
    );
}

const customStyles = {
    table: {
        style: {
            backgroundColor: 'white',
        },
    },
    headRow: {
        style: {
            backgroundColor: 'white',
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
            minHeight: '60px',
            fontSize: '0.875rem',
            '&:hover': {
                backgroundColor: '#f0fdfa',
            },
        },
    },
    cells: {
        style: {
            paddingLeft: '24px',
            paddingRight: '24px',
        },
    },
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

export default function AlunosAdmin() {
    const [searchInput, setSearchInput] = useState('');
    const [nivelFiltro, setNivelFiltro] = useState('');
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [sortField, setSortField] = useState('createdAt');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

    const debouncedSearch = useDebounce(searchInput, 400);

    const { data: response, isLoading, isFetching } = useAlunosAdmin({
        page,
        perPage,
        search: debouncedSearch || undefined,
        nivelEnsino: nivelFiltro || undefined,
        sortField,
        sortDirection,
    });

    const columns: TableColumn<AlunoAdmin>[] = useMemo(() => [
        {
            name: 'Aluno',
            sortable: true,
            sortField: 'nome',
            grow: 2,
            cell: (row: AlunoAdmin) => (
                <div className="flex items-center gap-3 py-2">
                    <div className="size-9 rounded-full bg-linear-to-br from-cyan-400 to-sky-500 flex items-center justify-center text-white font-bold text-sm shrink-0">
                        {row.nome.charAt(0).toUpperCase()}
                    </div>
                    <span className="font-bold text-gray-800 truncate">{row.nome}</span>
                </div>
            ),
        },
        {
            name: 'Email',
            sortable: true,
            sortField: 'email',
            grow: 2,
            cell: (row: AlunoAdmin) => (
                <span className="text-gray-500 truncate">{row.email}</span>
            ),
        },
        {
            name: 'Ano',
            sortable: true,
            sortField: 'anoEscolar',
            width: '100px',
            cell: (row: AlunoAdmin) => (
                <span className="font-semibold text-gray-700">{row.anoEscolar}º</span>
            ),
        },
        {
            name: 'Nível',
            sortable: true,
            sortField: 'nivelEnsino',
            width: '150px',
            cell: (row: AlunoAdmin) => <NivelBadge nivel={row.nivelEnsino} />,
        },
        {
            name: 'Plano',
            width: '150px',
            cell: (row: AlunoAdmin) => (
                <span className={`text-sm ${row.planoAtivo ? 'font-semibold text-gray-700' : 'text-gray-400 italic'}`}>
                    {row.planoAtivo || 'Nenhum'}
                </span>
            ),
        },
        {
            name: 'Status',
            width: '130px',
            cell: (row: AlunoAdmin) => <StatusBadge status={row.status} />,
        },
        {
            name: 'Cadastro',
            sortable: true,
            sortField: 'createdAt',
            width: '130px',
            cell: (row: AlunoAdmin) => (
                <span className="text-gray-500 text-xs">
                    {new Date(row.criadoEm).toLocaleDateString('pt-BR')}
                </span>
            ),
        },
        {
            name: '',
            width: '60px',
            right: true,
            cell: (row: AlunoAdmin) => (
                <button
                    onClick={() => setAlunoParaExcluir(row)}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all cursor-pointer"
                    title="Excluir aluno"
                >
                    <Trash2 size={16} />
                </button>
            ),
        },
    ], []);

    const handlePageChange = useCallback((p: number) => setPage(p), []);
    const handlePerRowsChange = useCallback((newPerPage: number) => {
        setPerPage(newPerPage);
        setPage(1);
    }, []);

    const handleSort = useCallback((column: TableColumn<AlunoAdmin>, direction: SortOrder) => {
        setSortField(column.sortField || 'createdAt');
        setSortDirection(direction);
        setPage(1);
    }, []);

    const handleSearchChange = useCallback((value: string) => {
        setSearchInput(value);
        setPage(1);
    }, []);

    const handleLimparFiltros = () => {
        setSearchInput('');
        setNivelFiltro('');
        setPage(1);
        setSortField('createdAt');
        setSortDirection('desc');
    };

    const hasFilters = !!searchInput || !!nivelFiltro;

    // Delete
    const [alunoParaExcluir, setAlunoParaExcluir] = useState<AlunoAdmin | null>(null);
    const queryClient = useQueryClient();

    const excluirMutation = useMutation({
        mutationFn: (alunoId: number) => api.delete(`/admin/alunos/${alunoId}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['adminAlunos'] });
            setAlunoParaExcluir(null);
        },
    });

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto bg-bg-secondary">
                    <AdminHeader
                        title="Alunos Cadastrados"
                        subtitle="Gerencie os estudantes e acompanhe seu progresso na plataforma"
                        showSearch={false}
                        showUserProfile={true}
                    />

                    <div className="p-4 md:p-6 lg:p-8">
                        {/* Filtros */}
                        <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm mb-6">
                            <div className="flex flex-wrap items-end gap-4">
                                {/* Search */}
                                <div className="flex flex-col flex-1 min-w-70">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                        Buscar Estudante
                                    </label>
                                    <div className="relative group">
                                        <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" />
                                        <input 
                                            type="text"
                                            value={searchInput}
                                            onChange={(e) => handleSearchChange(e.target.value)}
                                            placeholder="Nome ou email..."
                                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none"
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

                                {/* Nível de Ensino */}
                                <div className="flex flex-col w-56">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 px-1">
                                        Nível de Ensino
                                    </label>
                                    <select 
                                        value={nivelFiltro}
                                        onChange={(e) => { setNivelFiltro(e.target.value); setPage(1); }}
                                        className="w-full py-3 px-4 bg-gray-50 border-none rounded-xl focus:ring-2 focus:ring-primary/50 text-sm outline-none cursor-pointer"
                                    >
                                        <option value="">Todos os níveis</option>
                                        <option value="EF">Ensino Fundamental</option>
                                        <option value="EM">Ensino Médio</option>
                                        <option value="SUPERIOR">Ensino Superior</option>
                                    </select>
                                </div>

                                {/* Limpar */}
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

                        {/* Resumo */}
                        <div className="flex items-center justify-between mb-4 px-1">
                            <div className="flex items-center gap-2 text-sm">
                                <Users size={16} className="text-gray-400" />
                                <span className="text-gray-500 font-medium">Total:</span>
                                <span className="font-bold text-gray-800">{response?.total ?? 0} alunos</span>
                            </div>
                            {isFetching && !isLoading && (
                                <div className="flex items-center gap-2 text-xs text-gray-400">
                                    <div className="size-3 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                                    Atualizando...
                                </div>
                            )}
                        </div>

                        {/* Tabela */}
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                            <DataTable
                                columns={columns}
                                data={response?.data ?? []}
                                progressPending={isLoading}
                                progressComponent={
                                    <div className="flex items-center justify-center py-16">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="size-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                                            <span className="text-sm text-gray-400">Carregando alunos...</span>
                                        </div>
                                    </div>
                                }
                                noDataComponent={
                                    <div className="flex flex-col items-center justify-center py-16 text-center">
                                        <Users size={48} className="text-gray-300 mb-4" />
                                        <h3 className="text-lg font-bold text-gray-600 mb-1">Nenhum aluno encontrado</h3>
                                        <p className="text-sm text-gray-400 max-w-sm">
                                            {hasFilters
                                                ? 'Tente alterar os filtros ou buscar por outro termo.'
                                                : 'Ainda não há alunos cadastrados na plataforma.'
                                            }
                                        </p>
                                    </div>
                                }
                                pagination
                                paginationServer
                                paginationTotalRows={response?.total ?? 0}
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
            </main>

            {/* Modal de confirmação de exclusão */}
            {alunoParaExcluir && (
                <>
                    <div className="fixed inset-0 bg-black/50 z-50" onClick={() => !excluirMutation.isPending && setAlunoParaExcluir(null)} />
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="size-10 rounded-full bg-red-100 flex items-center justify-center">
                                    <AlertTriangle size={20} className="text-red-600" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-800">Excluir Aluno</h3>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">
                                Tem certeza que deseja excluir o aluno <strong>{alunoParaExcluir.nome}</strong>?
                            </p>
                            <p className="text-xs text-gray-400 mb-6">
                                Esta ação é irreversível. Todos os dados do aluno serão permanentemente removidos, incluindo progressos, assinaturas e histórico de conversas.
                            </p>

                            {excluirMutation.isError && (
                                <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl">
                                    Erro ao excluir aluno. Tente novamente.
                                </div>
                            )}

                            <div className="flex items-center justify-end gap-3">
                                <button
                                    onClick={() => setAlunoParaExcluir(null)}
                                    disabled={excluirMutation.isPending}
                                    className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-semibold text-sm hover:bg-gray-200 transition-colors cursor-pointer disabled:opacity-50"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={() => excluirMutation.mutate(alunoParaExcluir.id)}
                                    disabled={excluirMutation.isPending}
                                    className="px-5 py-2.5 bg-red-600 text-white rounded-xl font-semibold text-sm hover:bg-red-700 transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                                >
                                    {excluirMutation.isPending ? (
                                        <>
                                            <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            Excluindo...
                                        </>
                                    ) : (
                                        <>
                                            <Trash2 size={16} />
                                            Excluir
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
