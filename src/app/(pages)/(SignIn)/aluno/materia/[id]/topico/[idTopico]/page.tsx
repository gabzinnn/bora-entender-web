'use client';
import HeaderAluno from "@/app/components/HeaderAluno";
import AjudaCard from "@/app/components/MateriaAluno/AjudaCard";
import TopicoSkeleton from "@/app/components/Skeleton/TopicoSkeleton";
import ContentViewer from "@/app/components/TopicoAluno/ContentViewer";
import ListaConteudos from "@/app/components/TopicoAluno/ListaConteudos";
import NotasCard from "@/app/components/TopicoAluno/NotasCard";
import PDFContent from "@/app/components/TopicoAluno/PDFContent";
import QuizContent from "@/app/components/TopicoAluno/QuizContent";
import TextoContent from "@/app/components/TopicoAluno/TextoContent";
import VideoContent from "@/app/components/TopicoAluno/VideoContent";
import ProgressoTopico from "@/app/components/TopicoAluno/ProgressoTopico";
import { LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

// Dados mockados para demonstração
const mockTopico = {
    id: 1,
    moduloNumero: "Módulo 01",
    titulo: "O Começo de Tudo",
    cor: "#0cc3e4",
    materiaNome: "História Geral",
    materiaId: 1,
    progresso: {
        percentual: 35,
        atividadesConcluidas: 3,
        atividadesTotais: 8
    },
    conteudos: [
        { id: 1, titulo: "Vídeo: Boas Vindas", tipo: "VIDEO" as const, duracao: "02:30 min", status: "concluido" as const },
        { id: 2, titulo: "Guia de Estudos - Cap. 1", tipo: "PDF" as const, duracao: "15 min leitura", status: "atual" as const },
        { id: 3, titulo: "Resumo do Capítulo", tipo: "TEXTO" as const, duracao: "5 min leitura", status: "bloqueado" as const },
        { id: 4, titulo: "Vídeo: Aprofundando o tema", tipo: "VIDEO" as const, duracao: "12:45 min", status: "bloqueado" as const },
        { id: 5, titulo: "Quiz: Teste seus conhecimentos", tipo: "QUIZ" as const, questoes: 5, status: "bloqueado" as const },
    ],
    conteudoAtual: {
        id: 2,
        titulo: "Guia de Estudos - Cap. 1",
        tipo: "QUIZ" as const,
        paginaAtual: 1,
        totalPaginas: 5,
        concluido: false
    } as { id: number; titulo: string; tipo: "VIDEO" | "PDF" | "TEXTO" | "QUIZ"; paginaAtual: number; totalPaginas: number; concluido: boolean }
};

// Mock de questões para o Quiz
const mockQuestoes = [
    {
        id: 1,
        enunciado: "Qual foi a principal característica do período da história antiga?",
        alternativas: [
            { 
                id: 1, 
                texto: "Surgimento das primeiras civilizações e da escrita", 
                correta: true,
                justificativa: "Correto! O período da história antiga é marcado especialmente pelo surgimento da escrita (por volta de 4000 a.C.), que permitiu o registro de informações e o desenvolvimento das primeiras civilizações organizadas."
            },
            { 
                id: 2, 
                texto: "Descoberta da América", 
                correta: false,
                justificativa: "Incorreto. A descoberta da América ocorreu em 1492, marcando o início da Era Moderna, não da Antiguidade."
            },
            { 
                id: 3, 
                texto: "Revolução Industrial", 
                correta: false,
                justificativa: "Incorreto. A Revolução Industrial iniciou no século XVIII, na Idade Contemporânea, muito depois da Antiguidade."
            },
            { 
                id: 4, 
                texto: "Primeira Guerra Mundial", 
                correta: false,
                justificativa: "Incorreto. A Primeira Guerra Mundial ocorreu entre 1914-1918, na Idade Contemporânea."
            },
        ]
    },
    {
        id: 2,
        enunciado: "Em qual região surgiu a escrita cuneiforme?",
        alternativas: [
            { 
                id: 5, 
                texto: "Egito", 
                correta: false,
                justificativa: "Incorreto. No Egito surgiu a escrita hieroglífica, não a cuneiforme."
            },
            { 
                id: 6, 
                texto: "Mesopotâmia", 
                correta: true,
                justificativa: "Correto! A escrita cuneiforme foi desenvolvida pelos sumérios na Mesopotâmia (atual Iraque), por volta de 3500 a.C., sendo uma das primeiras formas de escrita da humanidade."
            },
            { 
                id: 7, 
                texto: "China", 
                correta: false,
                justificativa: "Incorreto. Na China desenvolveu-se a escrita chinesa, baseada em ideogramas, diferente da cuneiforme."
            },
            { 
                id: 8, 
                texto: "Grécia", 
                correta: false,
                justificativa: "Incorreto. Na Grécia surgiu o alfabeto grego, derivado do fenício, não a escrita cuneiforme."
            },
        ]
    },
    {
        id: 3,
        enunciado: "Quando ocorreu a queda do Império Romano do Ocidente?",
        alternativas: [
            { 
                id: 9, 
                texto: "27 a.C.", 
                correta: false,
                justificativa: "Incorreto. Em 27 a.C. Otávio recebeu o título de Augusto, marcando o início do Império Romano, não sua queda."
            },
            { 
                id: 10, 
                texto: "476 d.C.", 
                correta: true,
                justificativa: "Correto! Em 476 d.C., o último imperador romano do ocidente, Rômulo Augusto, foi deposto pelo líder germânico Odoacro, marcando o fim da Antiguidade."
            },
            { 
                id: 11, 
                texto: "1453 d.C.", 
                correta: false,
                justificativa: "Incorreto. Em 1453 caiu o Império Romano do Oriente (Bizâncio), não o do Ocidente."
            },
            { 
                id: 12, 
                texto: "1789 d.C.", 
                correta: false,
                justificativa: "Incorreto. 1789 marca o início da Revolução Francesa, na Idade Contemporânea."
            },
        ]
    }
];

export default function TopicoPage() {
    const params = useParams();
    const materiaId = params.id as string;

    const [concluido, setConcluido] = useState(mockTopico.conteudoAtual.concluido);
    const [isLoading, setIsLoading] = useState(false);

    // Simulação - substitua pela chamada real da API
    const topico = mockTopico;
    const corMateria = topico.cor;

    if (isLoading) {
        return <TopicoSkeleton />;
    }

    const handleMarcarConcluido = () => {
        setConcluido(true);
        // TODO: Chamar API para marcar como concluído
    };

    const handleConteudoClick = (conteudoId: number) => {
        // TODO: Navegar para o conteúdo específico ou atualizar o viewer
        console.log('Navegar para conteúdo:', conteudoId);
    };

    const handleQuizComplete = (acertos: number, total: number) => {
        console.log(`Quiz finalizado: ${acertos}/${total}`);
        // TODO: Salvar resultado do quiz na API
    };

    // Renderiza o conteúdo baseado no tipo
    const renderConteudo = () => {
        switch (topico.conteudoAtual.tipo) {
            case 'VIDEO':
                return (
                    <VideoContent
                        titulo={topico.conteudoAtual.titulo}
                        modulo={topico.moduloNumero}
                        videoUrl="https://www.w3schools.com/html/mov_bbb.mp4" // URL de exemplo
                        duracao={150}
                        cor={corMateria}
                        resumoHtml="<p>Este vídeo apresenta uma introdução ao estudo da história antiga, abordando os principais conceitos e períodos.</p>"
                        onComplete={() => setConcluido(true)}
                    />
                );
            
            case 'TEXTO':
                return (
                    <TextoContent
                        titulo="Resumo: Introdução à História Antiga"
                        modulo={topico.moduloNumero}
                        tempoLeitura={5}
                        cor={corMateria}
                        conteudoHtml={`
                            <h2>Principais Conceitos</h2>
                            <p>A história antiga é o período que abrange desde a invenção da escrita (c. 4000 a.C.) até a queda do Império Romano do Ocidente (476 d.C.).</p>
                            
                            <h3>Características do Período</h3>
                            <ul>
                                <li>Surgimento das primeiras civilizações</li>
                                <li>Desenvolvimento da escrita</li>
                                <li>Formação de grandes impérios</li>
                                <li>Avanços em arquitetura e engenharia</li>
                            </ul>
                            
                            <blockquote>
                                "A história é a mestra da vida." - Cícero
                            </blockquote>
                            
                            <h3>Civilizações Importantes</h3>
                            <p>Entre as principais civilizações do período, destacam-se:</p>
                            <ol>
                                <li><strong>Mesopotâmia</strong> - Berço da escrita cuneiforme</li>
                                <li><strong>Egito</strong> - Conhecida pelos faraós e pirâmides</li>
                                <li><strong>Grécia</strong> - Berço da democracia e filosofia</li>
                                <li><strong>Roma</strong> - Maior império da antiguidade</li>
                            </ol>
                        `}
                    />
                );
            
            case 'QUIZ':
                return (
                    <QuizContent
                        titulo={topico.conteudoAtual.titulo}
                        modulo={topico.moduloNumero}
                        questoes={mockQuestoes}
                        cor={corMateria}
                        onComplete={handleQuizComplete}
                    />
                );
            
            case 'PDF':
            default:
                return (
                    <PDFContent
                        titulo="Introdução à História Antiga"
                        modulo={topico.moduloNumero}
                        capitulo="Capítulo 1"
                        paginaAtual={topico.conteudoAtual.paginaAtual}
                        totalPaginas={topico.conteudoAtual.totalPaginas}
                        cor={corMateria}
                    />
                );
        }
    };

    return (
        <main className="w-full min-h-screen h-full flex flex-col">
            <HeaderAluno />
            
            <div className="flex-1 bg-bg-secondary px-4 sm:px-6 lg:px-8 py-6">
                {/* Breadcrumb */}
                <nav aria-label="Breadcrumb" className="flex mb-6">
                    <ol className="flex items-center space-x-2 text-sm font-medium flex-wrap">
                        <li>
                            <Link 
                                href="/aluno" 
                                className="text-gray-500 hover:text-primary transition-colors flex items-center gap-1"
                            >
                                <LayoutDashboard size={16} />
                                <span className="hidden sm:inline">Início</span>
                            </Link>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <Link 
                                href={`/aluno/materia/${materiaId}`}
                                className="text-gray-500 hover:text-primary transition-colors"
                            >
                                {topico.materiaNome}
                            </Link>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <span className="text-gray-500">{topico.moduloNumero}</span>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <span 
                                className="font-semibold"
                                style={{ color: corMateria }}
                            >
                                {topico.conteudoAtual.titulo}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: Content Viewer */}
                    <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                        <ContentViewer
                            titulo={topico.conteudoAtual.titulo}
                            tipo={topico.conteudoAtual.tipo}
                            paginaAtual={topico.conteudoAtual.paginaAtual}
                            totalPaginas={topico.conteudoAtual.totalPaginas}
                            onMarcarConcluido={handleMarcarConcluido}
                            concluido={concluido}
                            cor={corMateria}
                            showZoom={topico.conteudoAtual.tipo === 'PDF' || topico.conteudoAtual.tipo === 'TEXTO'}
                            showNavigation={topico.conteudoAtual.tipo !== 'QUIZ'}
                        >
                            {renderConteudo()}
                        </ContentViewer>

                        {/* Notas - não mostra para quiz */}
                        {topico.conteudoAtual.tipo !== 'QUIZ' && (
                            <NotasCard 
                                onSave={(notas) => console.log('Salvar notas:', notas)}
                            />
                        )}
                    </div>

                    {/* RIGHT COLUMN: Module Progress */}
                    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
                        {/* Progress Card */}
                        <ProgressoTopico
                            percentual={topico.progresso.percentual}
                            atividadesConcluidas={topico.progresso.atividadesConcluidas}
                            atividadesTotais={topico.progresso.atividadesTotais}
                            cor={corMateria}
                        />

                        {/* Module List */}
                        <ListaConteudos
                            moduloNumero={topico.moduloNumero}
                            moduloTitulo={topico.titulo}
                            conteudos={topico.conteudos}
                            conteudoAtualId={topico.conteudoAtual.id}
                            cor={corMateria}
                            onConteudoClick={handleConteudoClick}
                        />

                        {/* Support Banner */}
                        <AjudaCard />
                    </aside>
                </div>
            </div>
        </main>
    );
}