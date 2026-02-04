'use client';
import { ChevronLeft, ChevronRight, CheckCircle2 } from "lucide-react";
import LoadingSpinner from "../LoadingSpinner";

interface NavegacaoConteudoProps {
    onAnterior?: () => void;
    onProximo?: () => void;
    onMarcarConcluido?: () => void;
    concluido?: boolean;
    cor?: string;
    tipo?: 'PDF' | 'VIDEO' | 'TEXTO' | 'QUIZ';
    temAnterior?: boolean;
    temProximo?: boolean;
    tituloAnterior?: string;
    tituloProximo?: string;
    loadingConcluido?: boolean;
}

export default function NavegacaoConteudo({
    onAnterior,
    onProximo,
    onMarcarConcluido,
    concluido = false,
    cor = '#0cc3e4',
    tipo = 'TEXTO',
    temAnterior = true,
    temProximo = true,
    tituloAnterior,
    tituloProximo,
    loadingConcluido = false,
}: NavegacaoConteudoProps) {
    const getLabel = () => {
        if (concluido) return 'Concluído!';
        switch (tipo) {
            case 'VIDEO':
                return 'Marcar como assistido';
            case 'QUIZ':
                return 'Finalizar quiz';
            default:
                return 'Marcar como lido';
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Botão principal de conclusão */}
            <div className="p-6 border-b border-gray-100">
                <button 
                    onClick={onMarcarConcluido}
                    disabled={concluido || loadingConcluido}
                    className="w-full text-white font-bold py-4 px-6 rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 text-base disabled:cursor-default cursor-pointer"
                    style={{ 
                        backgroundColor: concluido ? '#22c55e' : cor,
                        boxShadow: `0 10px 25px -5px ${concluido ? '#22c55e' : cor}40`
                    }}
                >
                    {loadingConcluido ? <LoadingSpinner size="xs" /> : (concluido && <CheckCircle2 size={22} />)}
                    <span>{getLabel()}</span>
                </button>
            </div>

            {/* Navegação entre conteúdos */}
            <div className="p-4 flex justify-between items-stretch gap-3">
                {/* Botão Anterior */}
                <button 
                    onClick={onAnterior}
                    disabled={!temAnterior}
                    className="flex-1 group flex flex-col items-start p-4 rounded-xl border-2 border-gray-100 hover:border-gray-200 hover:bg-gray-50 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-gray-100 cursor-pointer"
                >
                    <div className="flex items-center gap-2 text-gray-400 group-hover:text-gray-600 transition-colors mb-1">
                        <ChevronLeft size={18} />
                        <span className="text-xs font-medium uppercase tracking-wide">Anterior</span>
                    </div>
                    {tituloAnterior && (
                        <span className="text-sm font-semibold text-gray-700 line-clamp-1 text-left">
                            {tituloAnterior}
                        </span>
                    )}
                </button>

                {/* Botão Próximo */}
                <button 
                    onClick={onProximo}
                    disabled={!temProximo}
                    className="flex-1 group flex flex-col items-end p-4 rounded-xl border-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:border-gray-100 cursor-pointer"
                    style={{ 
                        borderColor: temProximo ? `${cor}30` : undefined,
                        backgroundColor: temProximo ? `${cor}05` : undefined 
                    }}
                    onMouseEnter={(e) => {
                        if (temProximo) {
                            e.currentTarget.style.borderColor = `${cor}50`;
                            e.currentTarget.style.backgroundColor = `${cor}10`;
                        }
                    }}
                    onMouseLeave={(e) => {
                        if (temProximo) {
                            e.currentTarget.style.borderColor = `${cor}30`;
                            e.currentTarget.style.backgroundColor = `${cor}05`;
                        }
                    }}
                >
                    <div className="flex items-center gap-2 transition-colors mb-1" style={{ color: temProximo ? cor : undefined }}>
                        <span className="text-xs font-medium uppercase tracking-wide">Próximo</span>
                        <ChevronRight size={18} />
                    </div>
                    {tituloProximo && (
                        <span className="text-sm font-semibold text-gray-700 line-clamp-1 text-right">
                            {tituloProximo}
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
