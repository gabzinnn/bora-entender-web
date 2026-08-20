"use client";

import React, { useState } from "react";
import { MessageCircle, Lightbulb, Check, X, ChevronRight, Trophy, Sparkles, Coins, Star } from "lucide-react";
import type { Quest } from "../engine/GameTypes";

interface QuestModalProps {
    quest: Quest;
    hints: number;
    onComplete: (acertos: number, total: number) => void;
    onClose: () => void;
}

export default function QuestModal({ quest, hints, onComplete, onClose }: QuestModalProps) {
    const [phase, setPhase] = useState<"dialog" | "quiz" | "result">("dialog");
    const [currentQ, setCurrentQ] = useState(0);
    const [selected, setSelected] = useState<number | null>(null);
    const [confirmed, setConfirmed] = useState(false);
    const [results, setResults] = useState<boolean[]>([]);
    const [showHint, setShowHint] = useState(false);

    const question = quest.questions[currentQ];
    const totalQuestions = quest.questions.length;

    const handleConfirm = () => {
        if (selected === null) return;
        const alt = question.alternativas.find((a) => a.id === selected);
        const correct = alt?.correta || false;
        setResults((prev) => [...prev, correct]);
        setConfirmed(true);
    };

    const handleNext = () => {
        if (currentQ < totalQuestions - 1) {
            setCurrentQ((prev) => prev + 1);
            setSelected(null);
            setConfirmed(false);
            setShowHint(false);
        } else {
            setPhase("result");
        }
    };

    const acertos = results.filter(Boolean).length;

    // ─── DIALOG PHASE ──────────────────────────────────────────
    if (phase === "dialog") {
        return (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-slate-900 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl max-w-lg w-full animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                            <MessageCircle className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-white">{quest.npcName}</h3>
                            <p className="text-xs text-indigo-400 font-semibold">{quest.subject} · {quest.zone}</p>
                        </div>
                    </div>

                    <div className="bg-slate-950 rounded-2xl p-5 mb-6 border-l-4 border-indigo-500">
                        <p className="text-slate-300 italic leading-relaxed">&ldquo;{quest.dialog}&rdquo;</p>
                    </div>

                    <div className="bg-slate-800/50 rounded-xl p-4 mb-6 flex items-center justify-between">
                        <div>
                            <p className="text-sm font-bold text-white">{quest.title}</p>
                            <p className="text-xs text-slate-400">{totalQuestions} questões · Nível {quest.requiredLevel}+</p>
                        </div>
                        <div className="flex gap-3 text-xs">
                            <span className="flex items-center gap-1 text-indigo-400 font-bold">
                                <Star className="w-3 h-3" /> {quest.reward.xp} XP
                            </span>
                            <span className="flex items-center gap-1 text-yellow-400 font-bold">
                                <Coins className="w-3 h-3" /> {quest.reward.coins}G
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button onClick={onClose} className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-bold transition-all text-slate-300">
                            Fugir
                        </button>
                        <button onClick={() => setPhase("quiz")} className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-sm font-bold transition-all shadow-lg shadow-indigo-500/20">
                            Aceitar Desafio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── RESULT PHASE ──────────────────────────────────────────
    if (phase === "result") {
        const ratio = acertos / totalQuestions;
        const passed = ratio >= 0.5;

        return (
            <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-3xl shadow-2xl max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-200">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${passed ? "bg-emerald-500/20" : "bg-red-500/20"}`}>
                        {passed ? <Trophy className="w-10 h-10 text-emerald-400" /> : <X className="w-10 h-10 text-red-400" />}
                    </div>

                    <h3 className="text-2xl font-bold mb-2">{passed ? "Missão Completa!" : "Derrota..."}</h3>
                    <p className="text-slate-400 mb-6">{passed ? "Ótimo trabalho, aventureiro!" : "Estude mais e tente novamente."}</p>

                    <div className="bg-slate-950 rounded-2xl p-6 mb-6 border border-slate-800">
                        <p className="text-4xl font-black text-white mb-1">
                            {acertos}<span className="text-lg text-slate-500">/{totalQuestions}</span>
                        </p>
                        <p className="text-sm text-slate-500">questões corretas</p>

                        {passed && (
                            <div className="flex justify-center gap-6 mt-4 pt-4 border-t border-slate-800">
                                <div className="flex items-center gap-1.5 text-indigo-400">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-bold">+{Math.round(quest.reward.xp * ratio)} XP</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-yellow-400">
                                    <Coins className="w-4 h-4" />
                                    <span className="font-bold">+{Math.round(quest.reward.coins * ratio)}G</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex gap-2 justify-center flex-wrap">
                        {results.map((r, i) => (
                            <div key={i} className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold text-white ${r ? "bg-emerald-500" : "bg-red-500"}`}>
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            onComplete(acertos, totalQuestions);
                        }}
                        className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg transition-all"
                    >
                        Coletar Recompensa
                    </button>
                </div>
            </div>
        );
    }

    // ─── QUIZ PHASE ────────────────────────────────────────────
    const progress = ((currentQ + 1) / totalQuestions) * 100;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl max-w-2xl w-full overflow-hidden animate-in fade-in duration-200">
                {/* Progress bar */}
                <div className="p-5 border-b border-slate-800">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-xs font-bold text-indigo-400">{quest.subject}</span>
                        <span className="text-sm font-bold text-slate-400">
                            Questão {currentQ + 1} de {totalQuestions}
                        </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
                    </div>
                </div>

                {/* Question */}
                <div className="p-5 sm:p-6">
                    <h4 className="text-lg sm:text-xl font-bold text-white mb-6 leading-relaxed">{question.enunciado}</h4>

                    <div className="space-y-3 mb-6">
                        {question.alternativas.map((alt, i) => {
                            const letter = String.fromCharCode(65 + i);
                            const isSelected = selected === alt.id;
                            const isCorrect = alt.correta;

                            let bgClass = "bg-slate-950 hover:bg-slate-800 border-slate-800";
                            if (confirmed && isCorrect) bgClass = "bg-emerald-900/30 border-emerald-500";
                            else if (confirmed && isSelected && !isCorrect) bgClass = "bg-red-900/30 border-red-500";
                            else if (isSelected) bgClass = "bg-indigo-900/30 border-indigo-500";

                            return (
                                <div key={alt.id}>
                                    <button
                                        onClick={() => !confirmed && setSelected(alt.id)}
                                        disabled={confirmed}
                                        className={`w-full px-5 py-4 rounded-xl border-2 ${bgClass} text-left transition-all flex items-start gap-3 disabled:cursor-default`}
                                    >
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${confirmed && isCorrect ? "bg-emerald-500 text-white"
                                                : confirmed && isSelected ? "bg-red-500 text-white"
                                                    : isSelected ? "bg-indigo-500 text-white"
                                                        : "bg-slate-800 text-slate-400"}`}>
                                            {confirmed ? (isCorrect ? <Check size={16} /> : isSelected ? <X size={16} /> : letter) : letter}
                                        </span>
                                        <span className="font-medium self-center text-slate-200">{alt.texto}</span>
                                    </button>

                                    {confirmed && (
                                        <div className={`ml-11 mt-2 p-3 rounded-lg border ${isCorrect ? "bg-emerald-900/20 border-emerald-800" : "bg-slate-900/50 border-slate-800"}`}>
                                            <div className="flex items-start gap-2">
                                                <Lightbulb size={14} className={`mt-0.5 shrink-0 ${isCorrect ? "text-emerald-400" : "text-slate-500"}`} />
                                                <p className={`text-sm ${isCorrect ? "text-emerald-300" : "text-slate-400"}`}>{alt.justificativa}</p>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-slate-800 flex gap-3 justify-between items-center bg-slate-950/50">
                    {!confirmed && hints > 0 && !showHint && (
                        <button
                            onClick={() => setShowHint(true)}
                            className="flex items-center gap-1.5 text-sm text-cyan-400 hover:text-cyan-300 transition"
                        >
                            <Sparkles className="w-4 h-4" /> Usar Dica ({hints})
                        </button>
                    )}
                    {!confirmed && showHint && (
                        <span className="text-xs text-cyan-400/80 italic">💡 Elimine as opções menos lógicas.</span>
                    )}
                    {confirmed && <div />}

                    {!confirmed ? (
                        <button
                            onClick={handleConfirm}
                            disabled={selected === null}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/20"
                        >
                            Confirmar
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-sm font-bold transition-all flex items-center gap-1.5 shadow-lg shadow-indigo-500/20"
                        >
                            {currentQ < totalQuestions - 1 ? (
                                <>Próxima <ChevronRight size={16} /></>
                            ) : (
                                <>Ver Resultado <Trophy size={16} /></>
                            )}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
