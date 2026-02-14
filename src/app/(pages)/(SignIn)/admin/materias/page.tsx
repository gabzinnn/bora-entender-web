'use client';
import { AdminHeader } from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import LoadingScreen from "@/app/components/LoadingScreen";
import { MateriaAdmCard } from "@/app/components/MateriaAdmCard";
import { CriarMateriaModal, type CriarMateriaData } from "@/app/components/Modals/CriarMateriaModal";
import useMateriaAdmin, { Materia } from "@/hooks/useMateriaAdmin";
import { useDebounce } from "@/hooks/useDebounce";
import { PlusCircle, Plus, BookOpen, Search } from "lucide-react";
import * as LucideIcons from "lucide-react";
import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";

interface MateriasAdmContentProps {
    materias: Materia[];
    onSearchChange: (input: string) => void;
    onAddMateria: () => void;
    isSearching: boolean;
    searchTerm: string;
}

function MateriasAdmContent({ materias, onSearchChange, onAddMateria, isSearching, searchTerm }: MateriasAdmContentProps) {
    const router = useRouter();
    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary">
            <AdminHeader
                showSearch={true}
                searchPlaceholder="Pesquisar por matéria..."
                actionLabel="Nova Matéria"
                actionIcon={PlusCircle}
                onActionClick={onAddMateria}
                showUserProfile={true}
                userName="Admin User"
                userRole="Gestor Principal"
                onSearchChange={onSearchChange}
            />
            <div className="p-4 md:p-6 lg:p-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 md:mb-8 font-lexend">
                    <div>
                        <h2 className="text-2xl md:text-3xl font-black text-text-primary tracking-tight">
                            Gestão de Matérias
                        </h2>
                        <p className="text-text-secondary text-sm md:text-base mt-1">
                            Organize tópicos, conteúdos e acompanhe o engajamento dos alunos.
                        </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                        <span className="text-text-tertiary font-medium">
                            {searchTerm ? 'Encontradas:' : 'Total:'}
                        </span>
                        <span className="font-bold text-text-primary">{materias.length} matérias</span>
                        <span className="text-text-tertiary">•</span>
                        <span className="font-bold text-text-primary">
                            {materias.reduce((acc, m) => acc + m.totalConteudos, 0)} conteúdos
                        </span>
                    </div>
                </div>

                {isSearching && (
                    <div className="flex items-center justify-center py-8">
                        <div className="flex items-center gap-3 text-text-secondary">
                            <Search className="w-5 h-5 animate-pulse" />
                            <span>Buscando matérias...</span>
                        </div>
                    </div>
                )}

                {!isSearching && materias.length === 0 && searchTerm && (
                    <div className="flex flex-col items-center justify-center py-16">
                        <Search className="w-16 h-16 text-text-tertiary mb-4" />
                        <h3 className="text-xl font-bold text-text-primary mb-2">
                            Nenhuma matéria encontrada
                        </h3>
                        <p className="text-text-secondary text-center max-w-md">
                            Não encontramos matérias com o termo &quot;{searchTerm}&quot;. Tente buscar por outro nome ou descrição.
                        </p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {materias.map((materia) => (
                        <MateriaAdmCard
                            key={materia.id}
                            {...materia}
                            onGerenciar={() => router.push(`/admin/materias/${materia.id}`)}
                        />
                    ))}

                    {/* Card de Adicionar Nova Matéria */}
                    <button onClick={onAddMateria} className="rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center p-8 group hover:border-primary/50 hover:bg-white transition-all cursor-pointer min-h-100">
                        <div className="w-16 h-16 rounded-full bg-bg-secondary flex items-center justify-center text-text-tertiary group-hover:bg-primary/10 group-hover:text-primary transition-all mb-4">
                            <Plus className="w-10 h-10" />
                        </div>
                        <h4 className="text-lg font-bold text-text-tertiary group-hover:text-primary transition-colors">
                            Cadastrar Nova Matéria
                        </h4>
                        <p className="text-sm text-text-tertiary mt-2 text-center max-w-60">
                            Crie uma nova disciplina e comece a adicionar tópicos e conteúdos.
                        </p>
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MateriasAdmin() {
    const [searchInput, setSearchInput] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const debouncedSearch = useDebounce(searchInput, 400);

    const queryClient = useQueryClient();
    const { data: materias = [], isLoading, isFetching, error } = useMateriaAdmin(debouncedSearch || undefined);

    const criarMateriaMutation = useMutation({
        mutationFn: (data: CriarMateriaData) => api.post('/materia/admin/criar', data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['materiasAdmin'] });
            setIsModalOpen(false);
        },
    });

    const handleSearchChange = useCallback((input: string) => {
        setSearchInput(input);
    }, []);

    const handleAddMateria = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleCriarMateria = useCallback((data: CriarMateriaData) => {
        criarMateriaMutation.mutate(data);
    }, [criarMateriaMutation]);

    // Função para obter o ícone do Lucide baseado no nome
    const getIconComponent = (iconName?: string | null, color?: string): React.ReactNode => {
        if (!iconName) return <BookOpen size={24} color={color || ''} />;
        
        const IconComponent = (LucideIcons as any)[iconName];
        const renderedIcon = IconComponent ? <IconComponent size={24} color={color || ''} /> : <BookOpen size={24} color={color || ''} />;
        return renderedIcon;
    };

    return (
        <div className="w-full h-screen flex flex-row">
            <AdminSidebar />
            <main className="flex flex-1 flex-col overflow-hidden">
                {isLoading && (
                    <LoadingScreen />
                )}
                {error && (
                    <div className="flex-1 flex items-center justify-center">
                        <p className="text-red-600">Erro ao carregar matérias: {error.message}</p>
                    </div>
                )}
                <MateriasAdmContent
                    materias={materias.map(m => ({ ...m, icone: getIconComponent(m.icone, m.cor) }))}
                    onSearchChange={handleSearchChange}
                    onAddMateria={handleAddMateria}
                    isSearching={isFetching && !!debouncedSearch}
                    searchTerm={debouncedSearch}
                />
            </main>

            {/* Modal criar matéria */}
            <CriarMateriaModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCriarMateria}
                isLoading={criarMateriaMutation.isPending}
            />

            {/* Erro do mutation */}
            {criarMateriaMutation.isError && (
                <div className="fixed bottom-6 right-6 z-50 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl shadow-lg font-lexend text-sm animate-in slide-in-from-bottom-4 duration-300">
                    {(criarMateriaMutation.error as any)?.response?.data?.message || 'Erro ao criar matéria.'}
                </div>
            )}
        </div>
    );
}