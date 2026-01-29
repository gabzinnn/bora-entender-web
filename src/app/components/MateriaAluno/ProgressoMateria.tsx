interface ProgressoMateriaProps {
    percentual: number;
    modulosConcluidos: number;
    modulosTotais: number;
    horasEstudadas: number;
    cor: string;
}

export default function ProgressoMateria({
    percentual,
    modulosConcluidos,
    modulosTotais,
    horasEstudadas,
    cor
}: ProgressoMateriaProps) {
    return (
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-4 sm:p-6 rounded-2xl border border-gray-200 shadow-sm">
            <div className="flex-1">
                <h2 className="font-bold text-xl sm:text-2xl text-gray-900 mb-2">Seu Progresso</h2>
                <div className="flex items-center gap-3 mb-2">
                    <div className="flex-1 h-2 sm:h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                            className="h-full rounded-full transition-all duration-500" 
                            style={{ width: `${percentual}%`, backgroundColor: cor }}
                        ></div>
                    </div>
                    <span className="font-bold text-base sm:text-lg" style={{ color: cor }}>{percentual}%</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500">Você completou {modulosConcluidos} de {modulosTotais} módulos disponíveis.</p>
            </div>
            <div className="hidden md:block w-px h-16 bg-gray-200 mx-4"></div>
            <div className="flex gap-4 sm:gap-6 justify-center md:justify-end">
                <div className="text-center">
                    <span className="block font-bold text-xl sm:text-2xl text-gray-900">{horasEstudadas}h</span>
                    <span className="text-[10px] sm:text-xs text-gray-500 uppercase tracking-wide">Estudadas</span>
                </div>
            </div>
        </div>
    );
}