'use client';
import HeaderAluno from "@/app/components/HeaderAluno";
import AjudaCard from "@/app/components/MateriaAluno/AjudaCard";
import TopicoSkeleton from "@/app/components/Skeleton/TopicoSkeleton";
import ContentViewer from "@/app/components/TopicoAluno/ContentViewer";
import ListaConteudos from "@/app/components/TopicoAluno/ListaConteudos";
import NavegacaoConteudo from "@/app/components/TopicoAluno/NavegacaoConteudo";
import NotasCard from "@/app/components/TopicoAluno/NotasCard";
import PDFContent from "@/app/components/TopicoAluno/PDFContent";
import QuizContent from "@/app/components/TopicoAluno/QuizContent";
import ResumoConteudo from "@/app/components/TopicoAluno/ResumoConteudo";
import TextoContent from "@/app/components/TopicoAluno/TextoContent";
import VideoContent from "@/app/components/TopicoAluno/VideoContent";
import ProgressoTopico from "@/app/components/TopicoAluno/ProgressoTopico";
import { LayoutDashboard, VideoOff, FileX, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import React, { useState, useEffect, useMemo } from "react";
import { useConcluirQuiz, useConteudo, useMarcarConteudoConcluido, useTopicoAluno, type TipoConteudo } from "@/hooks/useTopicoAluno";
import { useAuth } from "@/app/context/authContext";
import ConteudoSkeleton from "@/app/components/Skeleton/ConteudoSkeleton";

interface NotFoundComponentProps {
    corMateria: string;
    icone: React.ReactNode;
    conteudoTipo: "PDF" | "vídeo" | "texto" | "quiz";
}

const NotFoundComponent = ({ corMateria, icone, conteudoTipo }: NotFoundComponentProps) => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
            <div 
                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                style={{ backgroundColor: `${corMateria}15` }}
            >
                {icone}
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {conteudoTipo.charAt(0).toUpperCase() + conteudoTipo.slice(1).toLowerCase()} não disponível
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
                O conteúdo de {conteudoTipo.toLowerCase()} ainda não foi adicionado. Entre em contato com o suporte para mais informações.
            </p>
        </div>
    );
}

export default function TopicoPage() {
    const params = useParams();
    const materiaId = params.id as string;
    const topicoId = params.idTopico as string;
    const { user } = useAuth();

    const [conteudoId, setConteudoId] = useState<number | null>(null);
    const [concluido, setConcluido] = useState(false);
    const [pdfHtml, setPdfHtml] = useState<string | null>(null);
    const [loadingPdf, setLoadingPdf] = useState(false);

    // Busca os dados do tópico
    const { data: topicoAluno, isLoading: isLoadingTopicoAluno } = useTopicoAluno(topicoId, user?.id?.toString() || '', !!topicoId && !!user?.id);
    const { data: conteudo, isLoading: isLoadingConteudo } = useConteudo(conteudoId?.toString() || '', !!conteudoId);

    // Mutações
    const marcarConcluidoMutation = useMarcarConteudoConcluido();
    const concluirQuizMutation = useConcluirQuiz();

    // Inicializa o conteudoId com o conteudo atual do topico
    useEffect(() => {
        if (topicoAluno?.conteudoAtual?.id && !conteudoId) {
            setConteudoId(topicoAluno.conteudoAtual.id);
            setConcluido(topicoAluno.conteudoAtual.concluido);
        }
    }, [topicoAluno, conteudoId]);

    // Atualiza o estado de concluído quando o conteúdo muda
    useEffect(() => {
        if (conteudo) {
            // Busca o progresso no topicoAluno para este conteúdo
            const conteudoInfo = topicoAluno?.conteudos.find(c => c.id === conteudo.id);
            setConcluido(conteudoInfo?.status === 'concluido');
        }
    }, [conteudo, topicoAluno]);

    // Busca HTML do PDF quando o conteúdo é PDF
    useEffect(() => {
        if (conteudo?.tipo === 'PDF' && conteudo.pdf?.htmlUrl) {
            setLoadingPdf(true);
            fetch(conteudo.pdf.htmlUrl)
                .then(res => res.text())
                .then(html => setPdfHtml(html))
                .catch(err => {
                    console.error('Erro ao buscar HTML do PDF:', err);
                    setPdfHtml(null);
                })
                .finally(() => setLoadingPdf(false));
        } else {
            setPdfHtml(null);
        }
    }, [conteudo]);

    if (isLoadingTopicoAluno) {
        return <TopicoSkeleton />;
    }

    if (!topicoAluno) {
        return <div>Tópico não encontrado</div>;
    }

    const corMateria = topicoAluno.cor || '#0cc3e4';

    // Lógica de navegação entre conteúdos
    const conteudoAtualIndex = topicoAluno.conteudos.findIndex(c => c.id === conteudoId);
    const conteudoAnterior = conteudoAtualIndex > 0 ? topicoAluno.conteudos[conteudoAtualIndex - 1] : null;
    const conteudoProximo = conteudoAtualIndex < topicoAluno.conteudos.length - 1 ? topicoAluno.conteudos[conteudoAtualIndex + 1] : null;

    const handleMarcarConcluido = async () => {
        await marcarConcluidoMutation.mutateAsync({ idConteudo: conteudoId!.toString(), idAluno: user!.id!.toString() });
        setConcluido(true);
    };

    const handleConteudoClick = (conteudoId: number) => {
        setConteudoId(conteudoId);
    };

    const handleAnterior = () => {
        if (conteudoAnterior) {
            setConteudoId(conteudoAnterior.id);
        }
    };

    const handleProximo = () => {
        if (conteudoProximo) {
            setConteudoId(conteudoProximo.id);
        }
    };

    const handleQuizComplete = async (acertos: number, total: number) => {
        console.log(`Quiz finalizado: ${acertos}/${total}`);
        await concluirQuizMutation.mutateAsync({ idConteudo: conteudoId!.toString(), idAluno: user!.id!.toString(), acertos, totalQuestoes: total });
        setConcluido(true);
        if (conteudoProximo) {
            setConteudoId(conteudoProximo.id);
        }
    };

    // Renderiza o conteúdo baseado no tipo
    const renderConteudo = () => {
        if (!conteudo) return null;

        switch (conteudo.tipo) {
            case 'VIDEO':
                // Não renderiza se não houver URL do vídeo
                if (!conteudo.video?.url) {
                    return <NotFoundComponent corMateria={corMateria} icone={<VideoOff size={40} style={{ color: corMateria }} />} conteudoTipo="vídeo" />;
                }
                return (
                    <VideoContent
                        titulo={conteudo.titulo}
                        modulo={topicoAluno.moduloNumero}
                        videoUrl={conteudo.video.url}
                        duracao={conteudo.video.duracao || undefined}
                        cor={corMateria}
                        onComplete={() => setConcluido(true)}
                    />
                );
            
            case 'TEXTO':
                // Não renderiza se não houver corpo do texto
                if (!conteudo.texto?.corpo) {
                    return <NotFoundComponent corMateria={corMateria} icone={<FileX size={40} style={{ color: corMateria }} />} conteudoTipo="texto" />;
                }
                return (
                    <TextoContent
                        titulo={conteudo.titulo}
                        modulo={topicoAluno.moduloNumero}
                        tempoLeitura={conteudo.texto.tempoLeitura || undefined}
                        cor={corMateria}
                        conteudoHtml={conteudo.texto.corpo}
                    />
                );
            
            case 'QUIZ':
                // Não renderiza se não houver questões do quiz
                if (!conteudo.quiz?.questoes || conteudo.quiz.questoes.length === 0) {
                    return (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center flex flex-col items-center justify-center">
                            <div 
                                className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center"
                                style={{ backgroundColor: `${corMateria}15` }}
                            >
                                <AlertCircle size={40} style={{ color: corMateria }} />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                Quiz não disponível
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                As questões do quiz ainda não foram adicionadas. Entre em contato com o suporte para mais informações.
                            </p>
                        </div>
                    );
                }
                return (
                    <QuizContent
                        titulo={conteudo.titulo}
                        modulo={topicoAluno.moduloNumero}
                        questoes={conteudo.quiz.questoes.map(q => ({
                            ...q,
                            imagens: q.imagens?.map(img => ({
                                ...img,
                                legenda: img.legenda ?? undefined
                            })) || [],
                            alternativas: q.alternativas.map(alt => ({
                                ...alt,
                                justificativa: alt.justificativa ?? '',
                                imagens: alt.imagens?.map(img => ({
                                    url: img.url,
                                    legenda: img.legenda ?? undefined
                                })) || []
                            }))
                        }))}
                        cor={corMateria}
                        onComplete={handleQuizComplete}
                        isLoading={concluirQuizMutation.isPending}
                    />
                );
            
            case 'PDF':
            default:
                if (!conteudo.pdf?.url || !conteudo.pdf.htmlUrl) {
                    return <NotFoundComponent corMateria={corMateria} icone={<FileX size={40} style={{ color: corMateria }} />} conteudoTipo="PDF" />;
                }
                if (loadingPdf) {
                    return <ConteudoSkeleton />;
                }
                if (!pdfHtml) {
                    return <NotFoundComponent corMateria={corMateria} icone={<FileX size={40} style={{ color: corMateria }} />} conteudoTipo="PDF" />;
                }
                return (
                    <PDFContent
                        titulo={conteudo.titulo}
                        modulo={topicoAluno.moduloNumero}
                        capitulo="Capítulo 1"
                        paginaAtual={1}
                        totalPaginas={1}
                        cor={corMateria}
                        conteudoHtml={pdfHtml}
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
                                {topicoAluno.materiaNome}
                            </Link>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <span className="text-gray-500">{topicoAluno.moduloNumero}</span>
                        </li>
                        <li><span className="text-gray-300">/</span></li>
                        <li>
                            <span 
                                className="font-semibold"
                                style={{ color: corMateria }}
                            >
                                {conteudo?.titulo || topicoAluno.conteudoAtual?.titulo || ''}
                            </span>
                        </li>
                    </ol>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                    {/* LEFT COLUMN: Content Viewer */}
                    <div className="lg:col-span-8 xl:col-span-9 flex flex-col gap-4">
                        {isLoadingConteudo || !conteudo ? (
                            <ConteudoSkeleton />
                        ) : (
                            <>
                                <ContentViewer
                                    titulo={conteudo.titulo}
                                    tipo={conteudo.tipo}
                                    cor={corMateria}
                                    showZoom={conteudo.tipo === 'PDF' || conteudo.tipo === 'TEXTO'}
                                >
                                    {renderConteudo()}
                                </ContentViewer>

                                {/* Resumo - mostra apenas para vídeo quando houver resumo */}
                                {conteudo.tipo === 'VIDEO' && conteudo.video?.resumoId && (
                                    <ResumoConteudo
                                        resumoHtml={conteudo.video.resumo?.corpo || ''}
                                        cor={corMateria}
                                    />
                                )}

                                {/* Notas - não mostra para quiz */}
                                {conteudo.tipo !== 'QUIZ' && (
                                    <NotasCard 
                                        onSave={(notas) => console.log('Salvar notas:', notas)}
                                    />
                                )}

                                {/* Navegação - aparece no final de tudo */}
                                <NavegacaoConteudo
                                    onAnterior={handleAnterior}
                                    onProximo={handleProximo}
                                    onMarcarConcluido={handleMarcarConcluido}
                                    concluido={concluido}
                                    cor={corMateria}
                                    tipo={conteudo.tipo}
                                    temAnterior={!!conteudoAnterior}
                                    temProximo={!!conteudoProximo}
                                    tituloAnterior={conteudoAnterior?.titulo}
                                    tituloProximo={conteudoProximo?.titulo}
                                    loadingConcluido={marcarConcluidoMutation.isPending}
                                />
                            </>
                        )}
                    </div>

                    {/* RIGHT COLUMN: Module Progress */}
                    <aside className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 lg:sticky lg:top-24">
                        {/* Progress Card */}
                        <ProgressoTopico
                            percentual={topicoAluno.progresso.percentual}
                            atividadesConcluidas={topicoAluno.progresso.atividadesConcluidas}
                            atividadesTotais={topicoAluno.progresso.atividadesTotais}
                            cor={corMateria}
                        />

                        {/* Module List */}
                        <ListaConteudos
                            moduloNumero={topicoAluno.moduloNumero}
                            moduloTitulo={topicoAluno.titulo}
                            conteudos={topicoAluno.conteudos}
                            conteudoAtualId={conteudoId || topicoAluno.conteudoAtual?.id || 0}
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