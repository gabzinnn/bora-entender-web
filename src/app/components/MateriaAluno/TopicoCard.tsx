import { Check, Clock, Lock, MoveRight, Play } from "lucide-react";

interface TopicoCardProps {
    status: 'concluido' | 'em-andamento' | 'bloqueado';
    moduloNumero: string;
    titulo: string;
    descricao: string;
    duracao?: string;
    conteudosConcluidos?: number;
    conteudosTotais?: number;
    percentual?: number;
    tempoRestante?: string;
    cor: string;
    onClick?: () => void;
}

export default function TopicoCard({
    status,
    moduloNumero,
    titulo,
    descricao,
    duracao,
    conteudosConcluidos,
    conteudosTotais,
    percentual,
    tempoRestante,
    cor,
    onClick
}: TopicoCardProps) {
    const isConcluido = status === 'concluido';
    const emAndamento = status === 'em-andamento';
    const isBloqueado = status === 'bloqueado';

    return (
        <div className="group relative flex items-center gap-4 sm:gap-8 mb-6 sm:mb-8 z-10" onClick={onClick}>
            {/* Status Icon */}
            <div 
                className={`shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-full border-4 flex items-center ml-2 sm:ml-3.5 justify-center z-10 ${
                    isConcluido ? 'bg-green-500 text-white border-white shadow-md' :
                    emAndamento ? 'text-white border-white shadow-lg ring-4' :
                    'bg-gray-100 text-gray-400 border-white opacity-70'
                }`}
                style={emAndamento ? { 
                    backgroundColor: cor,
                    boxShadow: `0 10px 15px -3px ${cor}40`,
                    '--tw-ring-color': `${cor}30`
                } as React.CSSProperties : undefined}
            >
                {isConcluido && <Check size={24} className="sm:w-7 sm:h-7" />}
                {emAndamento && <Play size={24} className="icon-filled sm:w-7 sm:h-7" />}
                {isBloqueado && <Lock size={20} className="sm:w-6 sm:h-6" />}
            </div>

            {/* Content */}
            <div 
                className={`flex-1 rounded-xl sm:rounded-2xl border ${
                    emAndamento ? 'bg-white border-2 shadow-lg relative overflow-hidden' :
                    'bg-white border border-gray-200 shadow-sm hover:shadow-md'
                } p-4 sm:p-6 transition-shadow ${!isBloqueado ? 'cursor-pointer' : ''}`}
                style={emAndamento ? { 
                    borderColor: cor,
                    boxShadow: `0 10px 15px -3px ${cor}10`
                } : undefined}
            >
                {emAndamento && (
                    <div 
                        className="absolute -right-10 -top-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-10"
                        style={{ backgroundColor: cor }}
                    ></div>
                )}
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 relative">
                    <div className={isBloqueado ? 'grayscale opacity-70' : ''}>
                        <div className="flex items-center gap-2 mb-1 md:mb-2 flex-wrap">
                            {emAndamento && (
                                <span className="flex h-2 w-2 sm:h-2.5 sm:w-2.5 relative">
                                    <span 
                                        className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                                        style={{ backgroundColor: cor }}
                                    ></span>
                                    <span 
                                        className="relative inline-flex rounded-full h-2 w-2 sm:h-2.5 sm:w-2.5"
                                        style={{ backgroundColor: cor }}
                                    ></span>
                                </span>
                            )}
                            <span 
                                className={`text-[10px] sm:text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    isConcluido ? 'text-green-600 bg-green-100' :
                                    emAndamento ? '' :
                                    'text-gray-400 border border-gray-200'
                                }`}
                                style={emAndamento ? { color: cor } : undefined}
                            >
                                {isConcluido ? 'Concluído' : emAndamento ? 'Em Andamento' : 'Bloqueado'}
                            </span>
                            <span className="text-[10px] sm:text-xs text-gray-400">{moduloNumero}</span>
                        </div>
                        
                        <h3 className={`font-bold ${emAndamento ? 'text-lg sm:text-2xl' : 'text-base sm:text-xl'} ${isBloqueado ? 'text-gray-500' : 'text-gray-900'} mb-1 md:mb-2`}>
                            {titulo}
                        </h3>
                        
                        <p className={`text-xs sm:text-sm mt-1 ${isBloqueado ? 'text-gray-400' : 'text-gray-600'} line-clamp-2 sm:line-clamp-none`}>
                            {descricao}
                        </p>

                        {/* Progress Bar (apenas em andamento) */}
                        {emAndamento && (
                            <div className="flex items-center gap-3 max-w-xs mt-3 sm:mt-4">
                                <div className="flex-1 h-1.5 sm:h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full rounded-full transition-all duration-500" 
                                        style={{ width: `${percentual}%`, backgroundColor: cor }}
                                    ></div>
                                </div>
                                <span className="text-[10px] sm:text-xs font-bold text-gray-500">{percentual}%</span>
                            </div>
                        )}
                    </div>

                    {/* Right section */}
                    <div className="flex flex-col items-stretch sm:items-end gap-2 sm:gap-3 sm:min-w-35 w-full sm:w-auto">
                        {emAndamento && (
                            <>
                                <button 
                                    className="w-full sm:w-auto text-white font-bold py-2.5 sm:py-3 px-4 sm:px-6 rounded-lg sm:rounded-xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90"
                                    style={{ 
                                        backgroundColor: cor,
                                        boxShadow: `0 10px 15px -3px ${cor}40`
                                    }}
                                >
                                    <span className="text-sm sm:text-base">Continuar</span>
                                    <MoveRight size={16} />
                                </button>
                                <span className="text-[10px] sm:text-xs text-gray-400 font-medium text-center sm:text-right">Restam {tempoRestante}</span>
                            </>
                        )}

                        {isConcluido && (
                            <button 
                                className="px-3 sm:px-4 py-1.5 sm:py-2 font-medium text-xs sm:text-sm transition-colors border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                style={{ color: cor }}
                            >
                                Revisar
                            </button>
                        )}

                        {isBloqueado && (
                            <div className="flex items-center gap-2 text-gray-400">
                                <Clock size={18} />
                                <span className="text-sm font-medium">{duracao}</span>
                            </div>
                        )}

                        {!isConcluido && !emAndamento && !isBloqueado && conteudosConcluidos !== undefined && (
                            <div className="text-right">
                                <div className="text-sm font-bold text-gray-700">{conteudosConcluidos}/{conteudosTotais}</div>
                                <div className="text-xs text-gray-400">Aulas</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}