'use client';
import { AlertCircle, Check, CheckCircle, ChevronRight, Lightbulb, RotateCcw, Trophy, X, XCircle } from "lucide-react";
import { useState } from "react";

interface Alternativa {
    id: number;
    texto: string;
    correta: boolean;
    justificativa: string; // Explicação individual
    imagens?: { url: string; legenda?: string }[];
}

interface Questao {
    id: number;
    enunciado: string;
    imagens?: { url: string; legenda?: string }[];
    alternativas: Alternativa[];
}

interface QuizContentProps {
    titulo: string;
    modulo: string;
    questoes: Questao[];
    cor?: string;
    onComplete?: (acertos: number, total: number) => void;
}

export default function QuizContent({
    titulo,
    modulo,
    questoes,
    cor = '#0cc3e4',
    onComplete
}: QuizContentProps) {
    const [questaoAtual, setQuestaoAtual] = useState(0);
    const [respostaSelecionada, setRespostaSelecionada] = useState<number | null>(null);
    const [respostaConfirmada, setRespostaConfirmada] = useState(false);
    const [respostas, setRespostas] = useState<{ questaoId: number; alternativaId: number; correta: boolean }[]>([]);
    const [finalizado, setFinalizado] = useState(false);

    const questao = questoes[questaoAtual];
    const totalQuestoes = questoes.length;
    const progresso = ((questaoAtual + 1) / totalQuestoes) * 100;

    const handleSelecionarResposta = (alternativaId: number) => {
        if (!respostaConfirmada) {
            setRespostaSelecionada(alternativaId);
        }
    };

    const handleConfirmarResposta = () => {
        if (respostaSelecionada === null) return;

        const alternativa = questao.alternativas.find(a => a.id === respostaSelecionada);
        const correta = alternativa?.correta || false;

        setRespostas(prev => [...prev, {
            questaoId: questao.id,
            alternativaId: respostaSelecionada,
            correta
        }]);
        setRespostaConfirmada(true);
    };

    const handleProximaQuestao = () => {
        if (questaoAtual < totalQuestoes - 1) {
            setQuestaoAtual(prev => prev + 1);
            setRespostaSelecionada(null);
            setRespostaConfirmada(false);
        } else {
            const acertos = respostas.filter(r => r.correta).length + 
                (questao.alternativas.find(a => a.id === respostaSelecionada)?.correta ? 1 : 0);
            setFinalizado(true);
            onComplete?.(acertos, totalQuestoes);
        }
    };

    const handleReiniciar = () => {
        setQuestaoAtual(0);
        setRespostaSelecionada(null);
        setRespostaConfirmada(false);
        setRespostas([]);
        setFinalizado(false);
    };

    const acertosFinais = respostas.filter(r => r.correta).length;
    const percentualAcertos = Math.round((acertosFinais / totalQuestoes) * 100);
    const alternativaSelecionada = questao?.alternativas.find(a => a.id === respostaSelecionada);

    // Tela de resultado final
    if (finalizado) {
        const isAprovado = percentualAcertos >= 70;

        return (
            <div className="w-full max-w-2xl">
                <div 
                    className="bg-white rounded-xl shadow-md overflow-hidden"
                    style={{
                        background: `linear-gradient(135deg, ${isAprovado ? '#22c55e' : '#f97316'}15 0%, white 50%)`
                    }}
                >
                    <div className="p-8 text-center">
                        <div 
                            className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg ${
                                isAprovado ? 'bg-green-100' : 'bg-orange-100'
                            }`}
                        >
                            {isAprovado ? (
                                <Trophy className="text-green-600" size={48} />
                            ) : (
                                <AlertCircle className="text-orange-600" size={48} />
                            )}
                        </div>

                        <h2 className="text-3xl font-bold text-gray-900 mb-3">
                            {isAprovado ? 'Parabéns!' : 'Continue estudando'}
                        </h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            {isAprovado 
                                ? 'Você demonstrou excelente compreensão do conteúdo.'
                                : 'Revise o material e tente novamente para melhorar seu desempenho.'
                            }
                        </p>

                        <div className="relative mb-8">
                            <div 
                                className="absolute inset-0 rounded-2xl opacity-20 blur-xl"
                                style={{ backgroundColor: isAprovado ? '#22c55e' : '#f97316' }}
                            />
                            <div className="relative bg-linear-to-br from-gray-50 to-white rounded-2xl p-8 border-2"
                                style={{ borderColor: isAprovado ? '#22c55e' : '#f97316' }}
                            >
                                <div className="text-6xl font-black mb-3" style={{ color: isAprovado ? '#22c55e' : '#f97316' }}>
                                    {percentualAcertos}%
                                </div>
                                <p className="text-gray-600 text-lg">
                                    <strong className="text-gray-900">{acertosFinais}</strong> de <strong className="text-gray-900">{totalQuestoes}</strong> questões corretas
                                </p>
                            </div>
                        </div>

                        <div className="mb-8">
                            <p className="text-sm font-medium text-gray-500 mb-3">Resumo das questões</p>
                            <div className="flex justify-center gap-2 flex-wrap">
                                {respostas.map((r, i) => (
                                    <div 
                                        key={i}
                                        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold text-white shadow-sm transition-transform hover:scale-110 ${
                                            r.correta ? 'bg-green-500' : 'bg-red-500'
                                        }`}
                                        title={r.correta ? 'Acertou' : 'Errou'}
                                    >
                                        {i + 1}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={handleReiniciar}
                                className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border-2 border-gray-200 text-gray-700 font-bold hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-95 cursor-pointer"
                            >
                                <RotateCcw size={18} />
                                Tentar novamente
                            </button>
                            {isAprovado && (
                                <button
                                    className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl text-white font-bold transition-all active:scale-95 shadow-lg cursor-pointer"
                                    style={{ 
                                        backgroundColor: cor,
                                        boxShadow: `0 4px 14px ${cor}40`
                                    }}
                                >
                                    Continuar
                                    <ChevronRight size={18} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full max-w-2xl bg-white rounded-xl shadow-md overflow-hidden">
            {/* Header com progresso */}
            <div 
                className="p-4 sm:p-6 border-b border-gray-100 relative overflow-hidden"
                style={{
                    background: `linear-gradient(135deg, ${cor}08 0%, transparent 100%)`
                }}
            >
                <div 
                    className="absolute inset-0 opacity-5"
                    style={{
                        backgroundImage: `radial-gradient(circle at 2px 2px, ${cor} 1px, transparent 0)`,
                        backgroundSize: '20px 20px'
                    }}
                />

                <div className="relative flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <span 
                            className="text-xs font-bold px-2.5 py-1 rounded-full"
                            style={{ 
                                backgroundColor: `${cor}20`,
                                color: cor
                            }}
                        >
                            {modulo}
                        </span>
                    </div>
                    <span className="text-sm font-bold" style={{ color: cor }}>
                        Questão {questaoAtual + 1} de {totalQuestoes}
                    </span>
                </div>
                
                <div className="relative w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <div 
                        className="h-2.5 rounded-full transition-all duration-500"
                        style={{ 
                            width: `${progresso}%`, 
                            backgroundColor: cor,
                            boxShadow: `0 0 10px ${cor}40`
                        }}
                    />
                </div>
            </div>

            {/* Questão */}
            <div className="p-4 sm:p-6">
                <div className="mb-6">
                    <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 leading-relaxed">
                        {questao.enunciado}
                    </h3>
                </div>

                {/* Imagens do enunciado */}
                {questao.imagens && questao.imagens.length > 0 && (
                    <div className="mb-6 space-y-3">
                        {questao.imagens.map((img, i) => (
                            <figure key={i} className="rounded-xl overflow-hidden border border-gray-200 shadow-sm">
                                <img 
                                    src={img.url} 
                                    alt={img.legenda || 'Imagem da questão'} 
                                    className="w-full object-contain max-h-64 bg-gray-50"
                                />
                                {img.legenda && (
                                    <figcaption className="text-xs text-gray-500 text-center py-2 px-3 bg-gray-50 border-t border-gray-200">
                                        {img.legenda}
                                    </figcaption>
                                )}
                            </figure>
                        ))}
                    </div>
                )}

                {/* Alternativas */}
                <div className="space-y-3">
                    {questao.alternativas.map((alternativa, index) => {
                        const letra = String.fromCharCode(65 + index);
                        const isSelecionada = respostaSelecionada === alternativa.id;
                        const isCorreta = alternativa.correta;
                        
                        let bgColor = 'bg-gray-50 hover:bg-gray-100';
                        let borderColor = 'border-gray-200';
                        let textColor = 'text-gray-800';

                        if (respostaConfirmada) {
                            if (isCorreta) {
                                bgColor = 'bg-green-50';
                                borderColor = 'border-green-500';
                                textColor = 'text-green-800';
                            } else if (isSelecionada && !isCorreta) {
                                bgColor = 'bg-red-50';
                                borderColor = 'border-red-500';
                                textColor = 'text-red-800';
                            } else {
                                // Alternativas não selecionadas e incorretas ficam neutras
                                bgColor = 'bg-gray-50';
                                borderColor = 'border-gray-200';
                                textColor = 'text-gray-600';
                            }
                        } else if (isSelecionada) {
                            borderColor = 'border-2';
                            bgColor = `${cor}08`;
                        }

                        return (
                            <div key={alternativa.id} className="space-y-2">
                                <button
                                    onClick={() => handleSelecionarResposta(alternativa.id)}
                                    disabled={respostaConfirmada}
                                    className={`w-full p-4 rounded-xl border-2 ${borderColor} ${bgColor} ${textColor} text-left transition-all flex items-start gap-3 disabled:cursor-default hover:shadow-sm relative cursor-pointer`}
                                    style={isSelecionada && !respostaConfirmada ? { borderColor: cor } : undefined}
                                >
                                    {/* Badge "Sua resposta" */}
                                    {respostaConfirmada && isSelecionada && (
                                        <div 
                                            className="absolute -top-2 right-3 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm"
                                            style={{
                                                backgroundColor: isCorreta ? '#22c55e' : '#ef4444',
                                                color: 'white'
                                            }}
                                        >
                                            Sua resposta
                                        </div>
                                    )}

                                    <span 
                                        className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                                            respostaConfirmada && isCorreta 
                                                ? 'bg-green-500 text-white shadow-md' 
                                                : respostaConfirmada && isSelecionada && !isCorreta
                                                ? 'bg-red-500 text-white shadow-md'
                                                : isSelecionada
                                                ? 'text-white shadow-md'
                                                : 'bg-gray-200 text-gray-600'
                                        }`}
                                        style={isSelecionada && !respostaConfirmada ? { backgroundColor: cor } : undefined}
                                    >
                                        {respostaConfirmada ? (
                                            isCorreta ? <Check size={18} /> : 
                                            isSelecionada ? <X size={18} /> : letra
                                        ) : letra}
                                    </span>
                                    <span className="flex-1 font-medium">{alternativa.texto}</span>
                                </button>

                                {/* Justificativa de TODAS as alternativas após confirmar */}
                                {respostaConfirmada && (
                                    <div 
                                        className={`ml-12 p-3 rounded-lg border ${
                                            isCorreta
                                                ? 'bg-green-50 border-green-200'
                                                : 'bg-gray-50 border-gray-200'
                                        }`}
                                    >
                                        <div className="flex items-start gap-2">
                                            <Lightbulb 
                                                size={16} 
                                                className={`mt-0.5 shrink-0 ${isCorreta ? 'text-green-600' : 'text-gray-600'}`}
                                            />
                                            <div className="flex-1">
                                                {isCorreta && (
                                                    <div className="flex items-center gap-1.5 mb-1">
                                                        <CheckCircle size={14} className="text-green-600" />
                                                        <span className="text-xs font-bold text-green-700">Resposta correta</span>
                                                    </div>
                                                )}
                                                <p className={`text-sm leading-relaxed ${
                                                    isCorreta ? 'text-green-700' : 'text-gray-700'
                                                }`}>
                                                    {alternativa.justificativa}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 sm:p-6 border-t border-gray-100 bg-gray-50">
                {!respostaConfirmada ? (
                    <button
                        onClick={handleConfirmarResposta}
                        disabled={respostaSelecionada === null}
                        className="w-full py-3.5 rounded-xl text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                        style={{ backgroundColor: cor }}
                    >
                        Confirmar Resposta
                    </button>
                ) : (
                    <button
                        onClick={handleProximaQuestao}
                        className="w-full py-3.5 rounded-xl text-white font-bold transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg active:scale-95 cursor-pointer"
                        style={{ backgroundColor: cor }}
                    >
                        {questaoAtual < totalQuestoes - 1 ? (
                            <>
                                Próxima Questão
                                <ChevronRight size={20} />
                            </>
                        ) : (
                            <>
                                Ver Resultado Final
                                <Trophy size={20} />
                            </>
                        )}
                    </button>
                )}
            </div>
        </div>
    );
}