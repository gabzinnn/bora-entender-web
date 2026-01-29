'use client';
import { ChevronLeft, ChevronRight, Download, FileText, Fullscreen, HelpCircle, Minus, PlayCircle, Plus } from "lucide-react";
import { useState } from "react";

interface ContentViewerProps {
    titulo: string;
    subtitulo?: string;
    tipo: 'PDF' | 'VIDEO' | 'TEXTO' | 'QUIZ';
    children: React.ReactNode;
    paginaAtual?: number;
    totalPaginas?: number;
    onAnterior?: () => void;
    onProximo?: () => void;
    onMarcarConcluido?: () => void;
    concluido?: boolean;
    cor?: string;
    showZoom?: boolean;
    showNavigation?: boolean;
}

function getIconByTipo(tipo: ContentViewerProps['tipo']) {
    switch (tipo) {
        case 'VIDEO':
            return <PlayCircle size={18} />;
        case 'QUIZ':
            return <HelpCircle size={18} />;
        case 'PDF':
            return <Download size={18} />;
        case 'TEXTO':
        default:
            return <FileText size={18} />;
    }
}

function getTipoLabel(tipo: ContentViewerProps['tipo']) {
    switch (tipo) {
        case 'VIDEO':
            return 'Vídeo';
        case 'QUIZ':
            return 'Quiz';
        case 'PDF':
            return 'Material PDF';
        case 'TEXTO':
            return 'Leitura';
        default:
            return 'Conteúdo';
    }
}

export default function ContentViewer({
    titulo,
    tipo,
    children,
    paginaAtual = 1,
    totalPaginas = 1,
    onAnterior,
    onProximo,
    onMarcarConcluido,
    concluido = false,
    cor = '#0cc3e4',
    showZoom = true,
    showNavigation = true
}: ContentViewerProps) {
    const [zoom, setZoom] = useState(100);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 10, 150));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 10, 50));

    // Para vídeo e quiz, não mostramos o zoom
    const shouldShowZoom = showZoom && (tipo === 'PDF' || tipo === 'TEXTO');
    // Para quiz, não mostramos a navegação inferior (o quiz tem sua própria)
    const shouldShowNavigation = showNavigation && tipo !== 'QUIZ';

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col min-h-125">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between p-3 border-b border-gray-200 bg-gray-50/50 backdrop-blur-sm sticky top-0 z-10 gap-2">
                <h2 className="text-base font-bold text-gray-800 px-2 flex items-center gap-2 truncate">
                    <span 
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{ backgroundColor: `${cor}15`, color: cor }}
                    >
                        {getIconByTipo(tipo)}
                    </span>
                    <div className="flex flex-col min-w-0">
                        <span className="truncate">{titulo}</span>
                        <span className="text-xs font-normal text-gray-400">{getTipoLabel(tipo)}</span>
                    </div>
                </h2>
                
                <div className="flex items-center gap-1">
                    {shouldShowZoom && (
                        <>
                            <button 
                                onClick={handleZoomOut}
                                className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                                title="Diminuir Zoom"
                            >
                                <Minus size={18} />
                            </button>
                            <span className="text-xs font-semibold text-gray-500 px-2 select-none min-w-11.25 text-center">
                                {zoom}%
                            </span>
                            <button 
                                onClick={handleZoomIn}
                                className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                                title="Aumentar Zoom"
                            >
                                <Plus size={18} />
                            </button>
                            <div className="w-px h-4 bg-gray-300 mx-1 hidden sm:block" />
                        </>
                    )}
                    
                    {tipo === 'PDF' && (
                        <button 
                            className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all hidden sm:flex"
                            title="Download"
                        >
                            <Download size={18} />
                        </button>
                    )}
                    <button 
                        className="p-2 rounded-lg text-gray-500 hover:bg-white hover:text-primary hover:shadow-sm transition-all"
                        title="Tela Cheia"
                    >
                        <Fullscreen size={18} />
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div 
                className={`relative grow overflow-y-auto flex justify-center ${
                    tipo === 'VIDEO' ? 'bg-gray-900 p-0' : 'bg-gray-100 p-4 sm:p-8'
                }`}
                style={shouldShowZoom ? { fontSize: `${zoom}%` } : undefined}
            >
                {children}
            </div>

            {/* Footer Navigation */}
            {shouldShowNavigation && (
                <div className="p-3 sm:p-4 border-t border-gray-200 bg-white flex justify-between items-center gap-2">
                    <button 
                        onClick={onAnterior}
                        disabled={paginaAtual <= 1}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={18} />
                        <span className="hidden sm:inline">Anterior</span>
                    </button>
                    
                    <button 
                        onClick={onMarcarConcluido}
                        className="text-white font-bold py-2.5 px-4 sm:px-6 rounded-xl shadow-lg transition-all active:scale-95 flex items-center gap-2 text-sm sm:text-base"
                        style={{ 
                            backgroundColor: concluido ? '#22c55e' : cor,
                            boxShadow: `0 10px 15px -3px ${concluido ? '#22c55e' : cor}30`
                        }}
                    >
                        <span>{concluido ? 'Concluído!' : tipo === 'VIDEO' ? 'Marcar como visto' : 'Marcar como lido'}</span>
                        <span className="text-lg">{concluido ? '✓' : '○'}</span>
                    </button>
                    
                    <button 
                        onClick={onProximo}
                        disabled={paginaAtual >= totalPaginas}
                        className="text-sm font-medium text-gray-500 hover:text-gray-800 px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="hidden sm:inline">Próximo</span>
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}