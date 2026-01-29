'use client';
import HeaderAluno from "@/app/components/HeaderAluno";
import AjudaCard from "@/app/components/MateriaAluno/AjudaCard";
import MateriaCardInfo from "@/app/components/MateriaAluno/MateriaCard";
import ProgressoMateria from "@/app/components/MateriaAluno/ProgressoMateria";
import TopicoCard from "@/app/components/MateriaAluno/TopicoCard";
import MateriaSkeleton from "@/app/components/Skeleton/MateriaSkeleton";
import { useMateriaAluno } from "@/hooks/useMateriaAluno";
import { LayoutDashboard } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function MateriaUnica() {
    const params = useParams();
    const materiaId = params.id as string;
    const router = useRouter();

    const { data: materia, error, isLoading } = useMateriaAluno(materiaId, !!materiaId);

    const corMateria = materia?.cor || '#6B7280';

    if (isLoading) {
        return <MateriaSkeleton />;
    }

    if (error) {
        return (
            <main className="w-full min-h-screen h-full flex justify-center items-center">
                <p>Erro ao carregar os dados da matéria: {error.message}</p>
            </main>
        );
    }

    return (
        <main 
            className="w-full min-h-screen h-full flex flex-col"
            style={{ '--cor-materia': corMateria } as React.CSSProperties}
        >
            <HeaderAluno />
            <div className="flex-1 bg-bg-secondary px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
                {/* Breadcrumb */}
                <nav className="flex mb-6 lg:mb-8">
                    <ol className="flex items-center space-x-2 text-sm font-medium">
                        <li>
                            <a className="text-gray-500 hover:opacity-80 transition-colors flex items-center gap-1" href="/aluno" style={{ color: undefined }}>
                                <LayoutDashboard size={16} />
                                <span className="hidden sm:inline">Dashboard</span> 
                            </a>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <span className="font-semibold" style={{ color: corMateria }}>{materia?.nome}</span>
                        </li>
                    </ol>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Sidebar - Aparece primeiro no mobile, depois vai para o lado */}
                    <aside className="lg:col-span-3 flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-24 order-1 lg:order-0">
                        <MateriaCardInfo
                            nome={materia?.nome || "Matemática"}
                            nivel="Ensino Fundamental"
                            totalModulos={12}
                            icone="Calculator"
                            cor={corMateria}
                        />
                        <div className="hidden lg:block">
                            <AjudaCard />
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="lg:col-span-9 flex flex-col gap-6 lg:gap-8 order-2 lg:order-0">
                        <ProgressoMateria
                            percentual={materia?.progresso?.percentual || 0}
                            modulosConcluidos={materia?.progresso?.modulosConcluidos || 0}
                            modulosTotais={materia?.progresso?.modulosTotais || 0}
                            horasEstudadas={materia?.progresso?.horasEstudadas || 0}
                            cor={corMateria}
                        />

                        {/* Timeline dos Tópicos */}
                        <div className="relative pb-8 lg:pb-12 pl-2 sm:pl-4">
                            <div 
                                className="absolute left-[2.9rem] sm:left-[3.65rem] top-8 bottom-0 w-0.75 z-0"
                                style={{ backgroundColor: `${corMateria}5A` }}
                            ></div>
                            {materia?.topicos.map((topico, index) => (
                                <TopicoCard
                                    key={index}
                                    {...topico}
                                    descricao={topico.descricao || ''}
                                    cor={corMateria}
                                    onClick={() => router.push(`/aluno/materia/${materiaId}/topico/${topico.id}`)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Card de Ajuda - Aparece no final no mobile */}
                    <div className="lg:hidden order-3">
                        <AjudaCard />
                    </div>
                </div>
            </div>
        </main>
    );
}