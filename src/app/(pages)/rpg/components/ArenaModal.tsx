"use client";

import React, { useEffect, useState } from "react";
import { Zap, Timer, Coins, Star, Trophy } from "lucide-react";
import type { ArenaQuestion } from "../engine/GameTypes";

interface ArenaModalProps {
    onFetchQuestions: () => Promise<ArenaQuestion[]>;
    onSubmitReward: (xp: number, coins: number) => Promise<void>;
    onCelebrate: () => void;
    onClose: () => void;
}

export default function ArenaModal({
    onFetchQuestions,
    onSubmitReward,
    onCelebrate,
    onClose,
}: ArenaModalProps) {
    const [phase, setPhase] = useState<"intro" | "playing" | "result">("intro");
    const [questions, setQuestions] = useState<ArenaQuestion[]>([]);
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(60);
    const [streak, setStreak] = useState(0);

    // Timer
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (phase === "playing" && time > 0) {
            timer = setInterval(() => setTime((t) => t - 1), 1000);
        } else if (time === 0 && phase === "playing") {
            endGame();
        }
        return () => clearInterval(timer);
    }, [phase, time]);

    const startGame = async () => {
        const qs = await onFetchQuestions();
        setQuestions(qs);
        setQIndex(0);
        setScore(0);
        setTime(60);
        setStreak(0);
        setPhase("playing");
    };

    const endGame = async () => {
        setPhase("result");
        const coinsEarned = Math.floor(score / 10);
        await onSubmitReward(score, coinsEarned);
        if (score > 0) onCelebrate();
    };

    const handleAnswer = (optIndex: number) => {
        const q = questions[qIndex];
        if (q.answer === optIndex) {
            const streakBonus = Math.min(streak * 2, 10);
            const points = 10 + Math.floor(time / 2) + streakBonus;
            setScore((s) => s + points);
            setStreak((s) => s + 1);
        } else {
            setStreak(0);
        }

        if (qIndex < questions.length - 1) {
            setQIndex((i) => i + 1);
        } else {
            setTime(0); // Trigger end
        }
    };

    // ─── INTRO ─────────────────────────────────────────────────
    if (phase === "intro") {
        return (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in zoom-in-95 duration-200">
                <div className="bg-slate-900 border border-indigo-900/50 p-8 sm:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(79,70,229,0.2)] w-full max-w-xl text-center">
                    <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/30">
                        <Zap className="w-10 h-10 text-indigo-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Desafio contra o Tempo!</h3>
                    <p className="text-slate-400 mb-8 text-lg max-w-md mx-auto">
                        Responda o máximo de perguntas em <strong className="text-white">60 segundos</strong>. Quanto mais rápido e com mais acertos consecutivos, mais pontos!
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={onClose} className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl font-bold transition text-slate-300">
                            Voltar
                        </button>
                        <button onClick={startGame} className="px-10 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg shadow-indigo-500/25 transition-all hover:scale-105 active:scale-95">
                            Iniciar Desafio
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // ─── RESULT ────────────────────────────────────────────────
    if (phase === "result") {
        return (
            <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
                <div className="bg-slate-900 border border-indigo-900/50 p-8 rounded-[2.5rem] shadow-2xl w-full max-w-xl text-center">
                    <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Trophy className="w-8 h-8 text-amber-400" />
                    </div>
                    <h3 className="text-2xl font-bold mb-2">Tempo Esgotado!</h3>
                    <p className="text-slate-400 mb-6">Você sobreviveu à arena.</p>

                    <div className="bg-slate-950/50 p-6 rounded-2xl border border-slate-800 mb-6 flex justify-center gap-10">
                        <div className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Pontuação</p>
                            <p className="text-3xl font-black text-white">{score} <span className="text-sm text-slate-500">xp</span></p>
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-slate-500 font-bold uppercase mb-1">Moedas</p>
                            <p className="text-3xl font-black text-yellow-400">+{Math.floor(score / 10)} <span className="text-sm text-yellow-600">G</span></p>
                        </div>
                    </div>

                    <button
                        onClick={onClose}
                        className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl font-bold shadow-lg transition-all"
                    >
                        Coletar Recompensa
                    </button>
                </div>
            </div>
        );
    }

    // ─── PLAYING ───────────────────────────────────────────────
    const q = questions[qIndex];

    return (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md flex items-center justify-center z-[100] p-4 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-indigo-900/50 p-6 sm:p-8 rounded-[2rem] shadow-2xl w-full max-w-2xl">
                {/* Status bar */}
                <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-800">
                    <h2 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 flex items-center">
                        <Zap className="w-6 h-6 mr-2 text-indigo-500" /> Arena
                    </h2>
                    <div className="flex gap-4 items-center">
                        {streak > 1 && (
                            <span className="text-orange-400 text-sm font-bold animate-pulse">🔥 ×{streak}</span>
                        )}
                        <div className={`flex items-center bg-slate-950 px-3 py-1.5 rounded-full border ${time <= 10 ? "border-red-500/50" : "border-slate-800"}`}>
                            <Timer className={`w-4 h-4 mr-1.5 ${time <= 10 ? "text-red-500 animate-pulse" : "text-slate-400"}`} />
                            <span className={`font-mono font-bold ${time <= 10 ? "text-red-500" : "text-white"}`}>{time}s</span>
                        </div>
                        <span className="text-emerald-400 font-bold text-sm">{score} pts</span>
                    </div>
                </div>

                <p className="text-xs text-indigo-400 font-bold mb-3">
                    Questão {qIndex + 1} de {questions.length}
                </p>
                <h4 className="text-xl sm:text-2xl font-medium mb-6 leading-tight text-white">{q?.text}</h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {q?.options.map((opt, i) => (
                        <button
                            key={i}
                            onClick={() => handleAnswer(i)}
                            className="px-5 py-4 bg-slate-950 hover:bg-indigo-600 text-left rounded-xl border border-slate-800 hover:border-indigo-400 hover:shadow-lg transition-all"
                        >
                            <span className="font-bold text-slate-500 mr-3">{String.fromCharCode(65 + i)}</span>
                            <span className="font-medium text-lg text-slate-200">{opt}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
