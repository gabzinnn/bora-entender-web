'use client';
import { Check, X } from 'lucide-react';
import { useInView } from '@/hooks/useInView';

const features = [
    { name: 'Linguagem acessível (aluno p/ aluno)', us: true, them: false },
    { name: 'Trilhas organizadas por matéria', us: true, them: true },
    { name: 'Sistema de recompensas e gamificação', us: true, them: false },
    { name: 'Painel de acompanhamento para pais', us: true, them: false },
    { name: 'Vídeos curtos e objetivos', us: true, them: false },
    { name: 'Exercícios com aplicação prática', us: true, them: true },
    { name: 'Espaço direto para dúvidas', us: true, them: false },
    { name: 'Preço justo e transparente', us: true, them: false },
];

export default function ComparisonTable() {
    const [ref, inView] = useInView<HTMLDivElement>({ threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    return (
        <div ref={ref}>
            <div className={`reveal-scale ${inView ? 'in-view' : ''} overflow-hidden rounded-2xl border border-border-light shadow-sm`}>
                {/* Header */}
                <div className="grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_160px_160px] bg-linear-to-r from-primary/5 to-primary/10">
                    <div className="p-4 sm:p-5">
                        <span className="font-bold text-text-primary text-sm sm:text-base">Funcionalidade</span>
                    </div>
                    <div className="p-4 sm:p-5 text-center border-l border-border-light bg-primary/10">
                        <span className="font-bold text-primary text-sm sm:text-base">Bora Entender</span>
                    </div>
                    <div className="p-4 sm:p-5 text-center border-l border-border-light">
                        <span className="font-bold text-text-secondary text-sm sm:text-base">Concorrentes</span>
                    </div>
                </div>

                {/* Rows */}
                {features.map((feature, index) => (
                    <div
                        key={feature.name}
                        className={`reveal stagger-${index + 1} ${inView ? 'in-view' : ''} grid grid-cols-[1fr_120px_120px] sm:grid-cols-[1fr_160px_160px] border-t border-border-light ${index % 2 === 0 ? 'bg-white' : 'bg-bg-secondary/50'
                            }`}
                    >
                        <div className="p-4 sm:p-5 flex items-center">
                            <span className="text-sm sm:text-base text-text-primary">{feature.name}</span>
                        </div>
                        <div className="p-4 sm:p-5 flex items-center justify-center border-l border-border-light bg-primary/5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${feature.us ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'
                                }`}>
                                {feature.us ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                            </div>
                        </div>
                        <div className="p-4 sm:p-5 flex items-center justify-center border-l border-border-light">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-500 ${feature.them ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-400'
                                }`}>
                                {feature.them ? <Check size={18} strokeWidth={3} /> : <X size={18} strokeWidth={3} />}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
