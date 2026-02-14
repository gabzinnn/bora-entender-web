'use client';

import { Settings, BookOpen, Clock, Users, TrendingUp } from 'lucide-react';
import { LucideIcon } from 'lucide-react';

interface MateriaCardProps {
    /** ID da matéria */
    id: number;
    /** Nome da matéria */
    nome: string;
    /** Descrição da matéria */
    descricao?: string | null;
    /** Ícone da matéria (Lucide) */
    icone: React.ReactNode;
    /** Cor hexadecimal da matéria */
    cor?: string | null;
    /** Quantidade de tópicos */
    totalTopicos: number;
    /** Quantidade total de conteúdos */
    totalConteudos: number;
    /** Tempo total estimado em minutos */
    tempoTotalMin?: number;
    /** Número de alunos matriculados (via planos) */
    totalAlunos?: number;
    /** Dados de engajamento semanal (7 valores de 0-100) */
    engajamentoSemanal?: number[];
    /** Lista de tópicos com informações básicas */
    topicos?: Array<{
        id: number;
        titulo: string;
        ordem: number;
        duracaoMin?: number | null;
        totalConteudos: number;
    }>;
    /** Callback ao clicar em gerenciar */
    onGerenciar?: () => void;
}

export function MateriaAdmCard({
    id,
    nome,
    descricao,
    icone: Icon,
    cor = '#00ccf0',
    totalTopicos,
    totalConteudos,
    tempoTotalMin,
    totalAlunos = 0,
    engajamentoSemanal = [40, 60, 45, 85, 70, 95, 50],
    topicos = [],
    onGerenciar,
}: MateriaCardProps) {
    // Função para ajustar opacidade de cores hexadecimais
    const hexToRgba = (hex: string, alpha: number) => {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    };

    // Formatar tempo total (minutos -> horas e minutos)
    const formatarTempo = (minutos?: number) => {
        if (!minutos) return 'Não definido';
        const horas = Math.floor(minutos / 60);
        const mins = minutos % 60;
        if (horas === 0) return `${mins}min`;
        if (mins === 0) return `${horas}h`;
        return `${horas}h ${mins}min`;
    };

    // Função para obter a cor da barra baseada no valor
    const getBarColor = (value: number) => {
        if (value >= 80) return cor;
        if (value >= 60) return hexToRgba(cor || '#00ccf0', 0.6);
        if (value >= 40) return hexToRgba(cor || '#00ccf0', 0.4);
        return hexToRgba(cor || '#00ccf0', 0.2);
    };

    // Pegar os 2 primeiros tópicos para preview
    const topicosPreview = topicos.slice(0, 2);

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-border-light p-6 flex flex-col group hover:shadow-md transition-all font-lexend">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-4 flex-1 min-w-0">
                    <div 
                        className="w-14 h-14 rounded-xl flex items-center justify-center shrink-0"
                        style={{ 
                            backgroundColor: hexToRgba(cor || '#00ccf0', 0.1),
                            color: cor || '#00ccf0',
                        }}
                    >
                        {Icon}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-text-primary leading-tight truncate">{nome}</h3>
                        {descricao && (
                            <p className="text-xs text-text-tertiary mt-1 line-clamp-1">{descricao}</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Stats Grid - 3 colunas compactas */}
            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="flex flex-col p-2.5 bg-bg-secondary rounded-lg">
                    <div className="flex items-center gap-1 mb-0.5">
                        <BookOpen className="w-3 h-3 text-text-tertiary" />
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Tópicos</span>
                    </div>
                    <span className="text-base font-black text-text-primary">{totalTopicos}</span>
                </div>
                
                <div className="flex flex-col p-2.5 bg-bg-secondary rounded-lg">
                    <div className="flex items-center gap-1 mb-0.5">
                        <TrendingUp className="w-3 h-3 text-text-tertiary" />
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Conteúdos</span>
                    </div>
                    <span className="text-base font-black text-text-primary">{totalConteudos}</span>
                </div>

                <div className="flex flex-col p-2.5 bg-bg-secondary rounded-lg">
                    <div className="flex items-center gap-1 mb-0.5">
                        <Users className="w-3 h-3 text-text-tertiary" />
                        <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider">Alunos</span>
                    </div>
                    <span className="text-base font-black text-text-primary">{totalAlunos}</span>
                </div>
            </div>

            {/* Gráfico de Barras + Tempo */}
            <div className="grid grid-cols-5 gap-3 mb-4">
                {/* Gráfico de Barras (3 colunas) */}
                <div className="col-span-3 bg-bg-secondary rounded-xl p-4">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest mb-3 block">
                        Engajamento Semanal
                    </span>
                    <div className="flex items-end justify-between h-16 gap-1 px-1">
                        {engajamentoSemanal.map((value, idx) => (
                            <div
                                key={idx}
                                className="w-full rounded-t-sm transition-all duration-300 hover:opacity-80"
                                style={{ 
                                    height: `${value}%`,
                                    backgroundColor: getBarColor(value) || hexToRgba(cor || '#00ccf0', 0.2),
                                }}
                            />
                        ))}
                    </div>
                    <div className="flex justify-between mt-2 px-1">
                        <span className="text-[8px] text-text-secondary font-bold uppercase">Seg</span>
                        <span className="text-[8px] text-text-secondary font-bold uppercase">Dom</span>
                    </div>
                </div>

                {/* Tempo Total (2 colunas) */}
                <div 
                    className="col-span-2 rounded-xl p-3 flex flex-col justify-center items-center"
                    style={{ backgroundColor: hexToRgba(cor || '#00ccf0', 0.08) }}
                >
                    <Clock className="w-5 h-5 mb-1" style={{ color: cor || '#00ccf0' }} />
                    <span className="text-[9px] font-bold text-text-secondary uppercase tracking-wider text-center">
                        Duração
                    </span>
                    <span className="text-sm font-black text-text-primary mt-1">
                        {formatarTempo(tempoTotalMin)}
                    </span>
                </div>
            </div>

            {/* Preview de Tópicos (compacto - 2 tópicos) */}
            {topicosPreview.length > 0 && (
                <div className="space-y-2 mb-4">
                    <h4 className="text-[9px] font-bold text-text-secondary uppercase tracking-widest">
                        Principais Tópicos
                    </h4>
                    <div className="space-y-1.5">
                        {topicosPreview.map((topico) => (
                            <div
                                key={topico.id}
                                className="flex items-center gap-2 p-2 bg-bg-secondary border border-border-light rounded-lg hover:border-border-lighter transition-colors"
                            >
                                <span 
                                    className="flex items-center justify-center w-5 h-5 rounded text-[10px] font-black shrink-0"
                                    style={{ 
                                        backgroundColor: hexToRgba(cor || '#00ccf0', 0.15),
                                        color: cor || '#00ccf0'     
                                    }}
                                >
                                    {topico.ordem}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-text-primary truncate">{topico.titulo}</p>
                                    <p className="text-[10px] text-text-tertiary">
                                        {topico.totalConteudos} {topico.totalConteudos === 1 ? 'conteúdo' : 'conteúdos'}
                                        {topico.duracaoMin && ` • ${formatarTempo(topico.duracaoMin)}`}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    {topicos.length > 2 && (
                        <p className="text-[10px] text-text-tertiary text-center pt-1">
                            + {topicos.length - 2} {topicos.length - 2 === 1 ? 'tópico' : 'tópicos'}
                        </p>
                    )}
                </div>
            )}

            {/* Botão de Ação */}
            <div className="mt-auto">
                <button
                    onClick={onGerenciar}
                    className="w-full py-2.5 bg-white text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-2 group/btn shadow-sm cursor-pointer"
                    style={{
                        borderWidth: '1px',
                        borderColor: cor || '#00ccf0',
                        color: cor || '#00ccf0',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = cor || '#00ccf0';
                        e.currentTarget.style.color = '#ffffff';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#ffffff';
                        e.currentTarget.style.color = cor || '#00ccf0';
                    }}
                >
                    <Settings className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                    Gerenciar Tópicos e Conteúdos
                </button>
            </div>
        </div>
    );
}