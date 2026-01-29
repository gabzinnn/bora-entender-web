interface ProgressoTopicoProps {
    percentual: number;
    atividadesConcluidas: number;
    atividadesTotais: number;
    cor?: string;
}

export default function ProgressoTopico({
    percentual,
    atividadesConcluidas,
    atividadesTotais,
    cor = '#0cc3e4'
}: ProgressoTopicoProps) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-800">Seu Progresso</h3>
                <span 
                    className="text-xs font-bold px-2 py-1 rounded-md"
                    style={{ 
                        backgroundColor: `${cor}15`,
                        color: cor 
                    }}
                >
                    {percentual}%
                </span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-100 rounded-full h-2.5 mb-2 overflow-hidden">
                <div 
                    className="h-2.5 rounded-full transition-all duration-500"
                    style={{ 
                        width: `${percentual}%`,
                        backgroundColor: '#FFD500' // brand-yellow
                    }}
                />
            </div>
            
            <p className="text-xs text-gray-500 text-right">
                {atividadesConcluidas} de {atividadesTotais} atividades completas
            </p>
        </div>
    );
}