'use client';

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { PlusCircle, Search } from 'lucide-react';
import api from '@/services/axios';
import { AdminHeader } from '@/app/components/AdminHeader';
import AdminSidebar from '@/app/components/AdminSidebar';
import LoadingScreen from '@/app/components/LoadingScreen';
import { PlanoAdmCard } from '@/app/components/PlanoAdmCard';
import { CriarEditarPlanoModal } from '@/app/components/Modals/CriarEditarPlanoModal';
import usePlanoAdmin, { PlanoAdmin } from '@/hooks/usePlanoAdmin';
import { useDebounce } from '@/hooks/useDebounce';

export default function PlanosAdminPage() {
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [planoParaEditar, setPlanoParaEditar] = useState<PlanoAdmin | null>(null);
    const debouncedSearch = useDebounce(searchInput, 400);

    const queryClient = useQueryClient();
    const { data: planos = [], isLoading } = usePlanoAdmin();

    const deleteMutation = useMutation({
        mutationFn: (id: number) => api.delete(`/plano/${id}`),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['planosAdmin'] });
        },
    });

    const handleSearchChange = (input: string) => {
        setSearchInput(input);
    };

    const handleNovoPlano = () => {
        setPlanoParaEditar(null);
        setIsModalOpen(true);
    };

    const handleEditarPlano = (plano: PlanoAdmin) => {
        setPlanoParaEditar(plano);
        setIsModalOpen(true);
    };

    const handleExcluirPlano = async (id: number) => {
        if (confirm('Tem certeza que deseja excluir/desativar este plano?')) {
            deleteMutation.mutate(id);
        }
    };

    // Filtragem local por nome (já que o backend retorna tudo por enquanto)
    const planosFiltrados = planos.filter(plano =>
        plano.nome.toLowerCase().includes(debouncedSearch.toLowerCase())
    );

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden bg-bg-secondary">
                <AdminHeader
                    showSearch={true}
                    searchPlaceholder="Pesquisar planos..."
                    actionLabel="Novo Plano"
                    actionIcon={PlusCircle}
                    onActionClick={handleNovoPlano}
                    showUserProfile={true}
                    userName="Admin User"
                    userRole="Gestor Principal"
                    onSearchChange={handleSearchChange}
                />

                {isLoading ? (
                    <LoadingScreen />
                ) : (
                    <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 font-lexend">
                            <div>
                                <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                                    Gestão de Planos
                                </h2>
                                <p className="text-text-secondary text-sm md:text-base mt-1">
                                    Gerencie os planos de assinatura e seus benefícios.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                                <span className="text-text-tertiary font-medium">Total:</span>
                                <span className="font-bold text-text-primary">{planosFiltrados.length} planos</span>
                            </div>
                        </div>

                        {planosFiltrados.length === 0 && debouncedSearch && (
                            <div className="flex flex-col items-center justify-center py-16">
                                <Search className="w-16 h-16 text-text-tertiary mb-4" />
                                <h3 className="text-xl font-bold text-text-primary mb-2">
                                    Nenhum plano encontrado
                                </h3>
                                <p className="text-text-secondary text-center max-w-md">
                                    Não encontramos planos com o termo &quot;{debouncedSearch}&quot;.
                                </p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {planosFiltrados.map((plano) => (
                                <PlanoAdmCard
                                    key={plano.id}
                                    id={plano.id}
                                    nome={plano.nome}
                                    preco={plano.preco}
                                    periodo={plano.periodo}
                                    popular={plano.popular}
                                    ativo={plano.ativo}
                                    allowPix={plano.allowPix}
                                    totalMaterias={plano._count?.materias || 0}
                                    onEditar={() => handleEditarPlano(plano)}
                                    onExcluir={() => handleExcluirPlano(plano.id)}
                                />
                            ))}

                            {/* Card de Adicionar (apenas se não houver busca para não poluir) */}
                            {!debouncedSearch && (
                                <button onClick={handleNovoPlano} className="rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center p-8 group hover:border-primary/50 hover:bg-white transition-all cursor-pointer min-h-[300px]">
                                    <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
                                        <PlusCircle className="w-10 h-10" />
                                    </div>
                                    <h4 className="text-lg font-bold text-text-tertiary group-hover:text-primary transition-colors">
                                        Novo Plano
                                    </h4>
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </main>

            <CriarEditarPlanoModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                planoParaEditar={planoParaEditar}
            />
        </div>
    );
}
