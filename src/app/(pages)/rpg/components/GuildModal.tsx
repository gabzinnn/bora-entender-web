"use client";

import React, { useEffect, useState } from "react";
import { Crown, TrendingUp, Trophy, Paintbrush, Users, School, Star } from "lucide-react";
import type { SchoolRanking, StudentRanking, PlayerState } from "../engine/GameTypes";

const SHIRT_COLORS = [
    { name: "Azul Aprendiz", value: 0x3b82f6, hex: "bg-blue-500" },
    { name: "Vermelho Voraz", value: 0xef4444, hex: "bg-red-500" },
    { name: "Esmeralda Sábia", value: 0x10b981, hex: "bg-emerald-500" },
    { name: "Roxo Real", value: 0x8b5cf6, hex: "bg-purple-500" },
    { name: "Rosa Chocante", value: 0xec4899, hex: "bg-pink-500" },
    { name: "Cinza Golem", value: 0x4b5563, hex: "bg-gray-600" },
];

interface GuildModalProps {
    player: PlayerState;
    schoolRankings: SchoolRanking[];
    studentRankings: StudentRanking[];
    onSkinChange: (color: number) => void;
    onClose: () => void;
    onFetchRankings: () => void;
}

export default function GuildModal({
    player,
    schoolRankings,
    studentRankings,
    onSkinChange,
    onClose,
    onFetchRankings,
}: GuildModalProps) {
    const [tab, setTab] = useState<"schools" | "students" | "customize">("schools");
    const [activeColor, setActiveColor] = useState(
        SHIRT_COLORS.find((c) => c.value === player.shirtColor) || SHIRT_COLORS[0],
    );

    useEffect(() => {
        if (schoolRankings.length === 0) onFetchRankings();
    }, []);

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold flex items-center text-amber-400">
                        <Crown className="w-6 h-6 mr-2.5" /> Salão da Guilda
                    </h2>
                    <button onClick={onClose} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold text-slate-300 transition">
                        Sair
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b border-slate-800">
                    <button onClick={() => setTab("schools")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition ${tab === "schools" ? "text-amber-400 border-b-2 border-amber-400 bg-slate-800/30" : "text-slate-500 hover:text-slate-300"}`}>
                        <School className="w-4 h-4" /> Escolas
                    </button>
                    <button onClick={() => setTab("students")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition ${tab === "students" ? "text-indigo-400 border-b-2 border-indigo-400 bg-slate-800/30" : "text-slate-500 hover:text-slate-300"}`}>
                        <Users className="w-4 h-4" /> Alunos
                    </button>
                    <button onClick={() => setTab("customize")} className={`flex-1 py-3 text-sm font-bold flex items-center justify-center gap-2 transition ${tab === "customize" ? "text-pink-400 border-b-2 border-pink-400 bg-slate-800/30" : "text-slate-500 hover:text-slate-300"}`}>
                        <Paintbrush className="w-4 h-4" /> Visual
                    </button>
                </div>

                {/* Content */}
                <div className="p-5 overflow-y-auto flex-1">
                    {tab === "schools" && (
                        <div className="space-y-3">
                            {schoolRankings.map((s, i) => (
                                <div key={s.id} className={`flex items-center justify-between p-4 rounded-2xl border transition ${s.isCurrentSchool ? "bg-amber-900/20 border-amber-500/30" : "bg-slate-800/30 border-transparent"}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${i < 3 ? "bg-amber-500/20 text-amber-400" : "bg-slate-800 text-slate-500"}`}>
                                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                        </span>
                                        <div>
                                            <p className={`font-semibold text-sm ${s.isCurrentSchool ? "text-white" : "text-slate-300"}`}>
                                                {s.name} {s.isCurrentSchool && <span className="text-amber-400 text-xs ml-1">(Sua)</span>}
                                            </p>
                                            <p className="text-xs text-slate-500">{s.city}, {s.state} · {s.studentCount} alunos</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-emerald-400 flex items-center gap-1">
                                            <TrendingUp className="w-3 h-3" /> {s.totalXp.toLocaleString()}
                                        </p>
                                        <p className="text-xs text-slate-500">Média Lvl {s.avgLevel}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "students" && (
                        <div className="space-y-2">
                            {studentRankings.slice(0, 20).map((s, i) => (
                                <div key={s.id} className={`flex items-center justify-between p-3 rounded-xl transition ${s.isCurrentUser ? "bg-indigo-900/20 border border-indigo-500/30" : "bg-slate-800/20 border border-transparent"}`}>
                                    <div className="flex items-center gap-3">
                                        <span className={`w-7 font-bold text-sm ${i < 3 ? "text-amber-400" : "text-slate-500"}`}>
                                            {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `#${i + 1}`}
                                        </span>
                                        <div>
                                            <p className={`font-semibold text-sm ${s.isCurrentUser ? "text-white" : "text-slate-300"}`}>
                                                {s.name} {s.isCurrentUser && <span className="text-indigo-400 text-xs">(Você)</span>}
                                            </p>
                                            <p className="text-xs text-slate-500 truncate max-w-[180px]">{s.school}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <span className="text-indigo-400 font-bold flex items-center gap-1">
                                            <Star className="w-3 h-3" /> Lvl {s.level}
                                        </span>
                                        <span className="text-emerald-400 font-bold">{s.xp.toLocaleString()} XP</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {tab === "customize" && (
                        <div>
                            {/* Character preview */}
                            <div className="flex items-center justify-center p-6 bg-slate-950 rounded-2xl border border-slate-800 mb-6">
                                <div className="relative transform scale-[2.5] mt-4 mb-10">
                                    <div className="w-6 h-8 bg-slate-800 rounded-full opacity-0" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#ffedd5] rounded-full z-20" />
                                    <div className="absolute top-0 left-1/2 -translate-x-1/2 -ml-2 w-5 h-3 bg-[#1f2937] rounded-full z-20 -mt-1" />
                                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-5 bg-purple-700/50 rounded z-0" />
                                    <div className={`absolute top-3.5 left-1/2 -translate-x-1/2 w-5 h-6 ${activeColor.hex} rounded-sm z-10 transition-colors duration-300`} />
                                </div>
                            </div>

                            <p className="text-sm text-slate-400 font-semibold mb-3">Túnica da Jornada</p>
                            <div className="grid grid-cols-3 gap-3">
                                {SHIRT_COLORS.map((c, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setActiveColor(c); onSkinChange(c.value); }}
                                        className={`p-3 rounded-xl border flex flex-col items-center gap-2 transition-all hover:bg-slate-800 ${activeColor.value === c.value ? "bg-slate-800 border-white ring-1 ring-white/20" : "border-slate-800 opacity-70 hover:opacity-100"}`}
                                    >
                                        <div className={`w-7 h-7 rounded-full ${c.hex} shadow-inner`} />
                                        <span className="text-[10px] font-medium text-center leading-tight text-slate-300">{c.name}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
