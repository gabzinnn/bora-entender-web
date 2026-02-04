import { Check, FileText, HelpCircle, Lock, PlayCircle } from "lucide-react";

type StatusConteudo = 'concluido' | 'atual' | 'bloqueado';
type TipoConteudo = 'VIDEO' | 'PDF' | 'TEXTO' | 'QUIZ';

interface ConteudoItem {
    id: number;
    titulo: string;
    tipo: TipoConteudo;
    duracao?: string;
    questoes?: number;
    status: StatusConteudo;
}

interface ListaConteudosProps {
    moduloNumero: string;
    moduloTitulo: string;
    conteudos: ConteudoItem[];
    conteudoAtualId?: number;
    cor?: string;
    onConteudoClick?: (id: number) => void;
}

function getIconByTipo(tipo: TipoConteudo, status: StatusConteudo, cor: string) {
    const iconClass = "w-3.5 h-3.5";
    const color = status === 'atual' ? cor : '#9ca3af';
    
    switch (tipo) {
        case 'VIDEO':
            return <PlayCircle className={iconClass} style={{ color }} />;
        case 'PDF':
        case 'TEXTO':
            return <FileText className={iconClass} style={{ color }} />;
        case 'QUIZ':
            return <HelpCircle className={iconClass} style={{ color }} />;
        default:
            return <FileText className={iconClass} style={{ color }} />;
    }
}

function getMetaText(conteudo: ConteudoItem) {
    if (conteudo.tipo === 'QUIZ' && conteudo.questoes) {
        return `${conteudo.questoes} Perguntas`;
    }
    return conteudo.duracao || '';
}

export default function ListaConteudos({
    moduloNumero,
    moduloTitulo,
    conteudos,
    conteudoAtualId,
    cor = '#0cc3e4',
    onConteudoClick
}: ListaConteudosProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="p-4 border-b border-gray-100 bg-gray-50">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 block">
                    Módulo Atual
                </span>
                <h3 className="font-bold text-lg text-gray-800 leading-tight">
                    {moduloNumero}: {moduloTitulo}
                </h3>
            </div>

            {/* Lista de Conteúdos */}
            <div className="flex flex-col">
                {conteudos.map((conteudo, index) => {
                    const isAtual = conteudo.status === 'atual' || conteudo.id === conteudoAtualId;
                    const isConcluido = conteudo.status === 'concluido';
                    const isBloqueado = conteudo.status === 'bloqueado';
                    const isLast = index === conteudos.length - 1;

                    return (
                        <button
                            key={conteudo.id}
                            onClick={() => onConteudoClick?.(conteudo.id)}
                            className={`
                                group flex items-start gap-3 p-4 text-left transition-colors relative
                                ${!isLast ? 'border-b border-gray-100' : ''}
                                ${isAtual ? 'bg-primary/5' : 'hover:bg-gray-50'}
                                ${'cursor-pointer'}
                            `}
                            style={isAtual ? { 
                                borderLeftWidth: '3px',
                                borderLeftColor: cor 
                            } : undefined}
                        >
                            {/* Ícone de Status */}
                            <div className="mt-0.5 relative">
                                {isConcluido ? (
                                    <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center">
                                        <Check size={14} strokeWidth={3} />
                                    </div>
                                ) : isAtual ? (
                                    <div 
                                        className="w-6 h-6 rounded-full text-white flex items-center justify-center shadow-lg"
                                        style={{ 
                                            backgroundColor: cor,
                                            boxShadow: `0 4px 6px -1px ${cor}40`
                                        }}
                                    >
                                        {getIconByTipo(conteudo.tipo, 'atual', '#fff')}
                                    </div>
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center">
                                        <Lock size={12} />
                                    </div>
                                )}
                                
                                {/* Linha conectora */}
                                {!isLast && (
                                    <div className="absolute top-6 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gray-200 -z-10" />
                                )}
                            </div>

                            {/* Conteúdo */}
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start gap-2">
                                    <h4 className={`
                                        text-sm font-medium truncate
                                        ${isConcluido ? 'text-gray-500 line-through decoration-gray-400' : ''}
                                        ${isAtual ? 'font-bold text-gray-900' : 'text-gray-700'}
                                    `}>
                                        {conteudo.titulo}
                                    </h4>
                                    
                                    {/* Indicador pulsante para item atual */}
                                    {isAtual && (
                                        <span className="relative flex h-2 w-2 shrink-0 mt-1.5">
                                            <span 
                                                className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                                style={{ backgroundColor: cor }}
                                            />
                                            <span 
                                                className="relative inline-flex rounded-full h-2 w-2"
                                                style={{ backgroundColor: cor }}
                                            />
                                        </span>
                                    )}
                                </div>
                                
                                <div className="flex items-center gap-2 mt-1">
                                    {getIconByTipo(conteudo.tipo, isAtual ? 'atual' : 'bloqueado', cor)}
                                    <span 
                                        className={`text-xs ${isAtual ? 'font-medium' : ''}`}
                                        style={{ color: isAtual ? cor : '#9ca3af' }}
                                    >
                                        {getMetaText(conteudo)}
                                    </span>
                                </div>
                            </div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}