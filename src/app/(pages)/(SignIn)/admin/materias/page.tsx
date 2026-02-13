'use client';
import { AdminHeader } from "@/app/components/AdminHeader";
import AdminSidebar from "@/app/components/AdminSidebar";
import LoadingScreen from "@/app/components/LoadingScreen";
import { MateriaAdmCard } from "@/app/components/MateriaAdmCard";
import useMateriaAdmin, { Materia } from "@/hooks/useMateriaAdmin";
import { PlusCircle, Plus, Calculator, BookOpen, Microscope, Atom, Globe, Palette, Music, LucideIcon } from "lucide-react";
import * as LucideIcons from "lucide-react";

function MateriasAdmContent({ materias }: { materias: Materia[] }) {
    return (
        <div className="flex-1 overflow-y-auto bg-bg-secondary">
            <AdminHeader
                showSearch={true}
                searchPlaceholder="Pesquisar por matéria..."
                actionLabel="Nova Matéria"
                actionIcon={PlusCircle}
                onActionClick={() => console.log("Nova Matéria")}
                showUserProfile={true}
                userName="Admin User"
                userRole="Gestor Principal"
                onSearchChange={(input) => console.log("Novo input: " + input)}
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
                        <span className="text-text-tertiary font-medium">Total:</span>
                        <span className="font-bold text-text-primary">{materias.length} matérias</span>
                        <span className="text-text-tertiary">•</span>
                        <span className="font-bold text-text-primary">
                            {materias.reduce((acc, m) => acc + m.totalConteudos, 0)} conteúdos
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                    {materias.map((materia) => (
                        <MateriaAdmCard
                            key={materia.id}
                            {...materia}
                            onGerenciar={() => console.log(`Gerenciar ${materia.nome}`)}
                        />
                    ))}

                    {/* Card de Adicionar Nova Matéria */}
                    <button className="rounded-2xl border-2 border-dashed border-border-light flex flex-col items-center justify-center p-8 group hover:border-primary/50 hover:bg-white transition-all cursor-pointer min-h-100">
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
    const { data: materias = [], isLoading, error } = useMateriaAdmin();

    // Função para obter o ícone do Lucide baseado no nome
    const getIconComponent = (iconName?: string | null): LucideIcon => {
        if (!iconName) return BookOpen;
        
        // Tenta encontrar o ícone no pacote lucide-react
        const IconComponent = (LucideIcons as any)[iconName];
        return IconComponent || BookOpen;
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
                <MateriasAdmContent materias={materias.map(m => ({ ...m, icon: getIconComponent(m.icone) }))} />
            </main>
        </div>
    );
}