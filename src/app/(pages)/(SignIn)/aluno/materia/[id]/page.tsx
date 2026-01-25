'use client';
import HeaderAluno from "@/app/components/HeaderAluno";
import { useParams } from "next/navigation";
import { LayoutDashboard } from "lucide-react";
import MateriaCardInfo from "@/app/components/MateriaAluno/MateriaCard";
import ProgressoMateria from "@/app/components/MateriaAluno/ProgressoMateria";
import TopicoCard from "@/app/components/MateriaAluno/TopicoCard";
import AjudaCard from "@/app/components/MateriaAluno/AjudaCard";

export default function MateriaUnica() {
    const params = useParams();
    const materiaId = params.id;

    // TODO: Buscar da API - cor da matéria em hexadecimal
    const corMateria = "#00cdef"; // Cor customizada da matéria

    // TODO: Buscar dados da API
    const mockTopicos = [
        {
            status: 'concluido' as const,
            moduloNumero: 'Módulo 01',
            titulo: 'Fundamentos da Álgebra',
            descricao: 'Conceitos básicos, variáveis e equações de primeiro grau.',
            conteudosConcluidos: 10,
            conteudosTotais: 10,
        },
        {
            status: 'concluido' as const,
            moduloNumero: 'Módulo 02',
            titulo: 'Conjuntos Numéricos',
            descricao: 'Números naturais, inteiros, racionais e reais.',
            conteudosConcluidos: 8,
            conteudosTotais: 8,
        },
        {
            status: 'em-andamento' as const,
            moduloNumero: 'Módulo 03',
            titulo: 'Geometria Analítica',
            descricao: 'Pontos, retas e circunferências no plano cartesiano. Domine os conceitos espaciais.',
            percentual: 25,
            tempoRestante: '45 min',
        },
        {
            status: 'bloqueado' as const,
            moduloNumero: 'Módulo 04',
            titulo: 'Funções Exponenciais',
            descricao: 'Crescimento, decrescimento e aplicações práticas.',
            duracao: '4h 30m',
        },
        {
            status: 'bloqueado' as const,
            moduloNumero: 'Módulo 05',
            titulo: 'Trigonometria Avançada',
            descricao: 'Seno, cosseno, tangente e identidades fundamentais.',
            duracao: '5h 15m',
        },
    ];

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
                            <span className="font-semibold" style={{ color: corMateria }}>Matemática</span>
                        </li>
                    </ol>
                </nav>

                {/* Main Content */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Sidebar - Aparece primeiro no mobile, depois vai para o lado */}
                    <aside className="lg:col-span-3 flex flex-col gap-4 lg:gap-6 lg:sticky lg:top-24 order-1 lg:order-0">
                        <MateriaCardInfo
                            nome="Matemática"
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
                            percentual={42}
                            modulosConcluidos={3}
                            modulosTotais={7}
                            horasEstudadas={15}
                            xpGanho={850}
                            cor={corMateria}
                        />

                        {/* Timeline dos Tópicos */}
                        <div className="relative pb-8 lg:pb-12 pl-2 sm:pl-4">
                            <div 
                                className="absolute left-[2.9rem] sm:left-[3.65rem] top-8 bottom-0 w-0.75 z-0"
                                style={{ backgroundColor: corMateria }}
                            ></div>
                            {mockTopicos.map((topico, index) => (
                                <TopicoCard
                                    key={index}
                                    {...topico}
                                    cor={corMateria}
                                    onClick={() => console.log(`Clicou em: ${topico.titulo}`)}
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