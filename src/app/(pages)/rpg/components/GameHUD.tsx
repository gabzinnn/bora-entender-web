"use client";

import React from "react";
import { Coins, Heart, Map, Shield, Star, Sparkles, Brain, Zap, BookOpen } from "lucide-react";
import type { PlayerState } from "../engine/GameTypes";

interface GameHUDProps {
    player: PlayerState | null;
    zoneName: string;
}

export default function GameHUD({ player, zoneName }: GameHUDProps) {
    if (!player) return null;

    const xpPercent = player.xpToNextLevel > 0
        ? Math.min(100, ((player.level * 200 - player.xpToNextLevel) / (player.level * 200)) * 100)
        : 100;

    return (
        <>
            {/* Top-left: Zone indicator */}
            <div className="absolute top-4 left-4 bg-slate-950/80 backdrop-blur-md px-4 py-2 rounded-xl border border-slate-800 flex items-center shadow-lg pointer-events-none z-10">
                <Map className="w-4 h-4 mr-2 text-teal-400" />
                <span className="text-sm font-semibold text-slate-200">{zoneName}</span>
            </div>

            {/* Top-right: Stats bar */}
            <div className="absolute top-4 right-4 bg-slate-950/80 backdrop-blur-md px-4 py-2.5 rounded-xl border border-slate-800 shadow-lg pointer-events-none z-10">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5">
                        <Star className="w-4 h-4 text-indigo-400" />
                        <span className="text-sm font-bold text-indigo-400">Lvl {player.level}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-500"
                                style={{ width: `${xpPercent}%` }}
                            />
                        </div>
                        <span className="text-xs text-slate-500">{player.xp} XP</span>
                    </div>
                    <div className="w-px h-5 bg-slate-700" />
                    <div className="flex items-center gap-1">
                        <Coins className="w-4 h-4 text-yellow-400" />
                        <span className="text-sm font-bold text-yellow-400">{player.coins}G</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <Sparkles className="w-4 h-4 text-cyan-400" />
                        <span className="text-sm font-bold text-cyan-400">{player.hints}</span>
                    </div>
                </div>
            </div>

            {/* Bottom-left: Attributes mini panel */}
            <div className="absolute bottom-20 left-4 bg-slate-950/70 backdrop-blur-md px-3 py-2 rounded-xl border border-slate-800/50 pointer-events-none z-10">
                <div className="flex gap-3 text-xs">
                    <div className="flex items-center gap-1" title="Inteligência">
                        <Brain className="w-3 h-3 text-blue-400" />
                        <span className="font-bold text-blue-300">{player.attributes.inteligencia}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Agilidade">
                        <Zap className="w-3 h-3 text-yellow-400" />
                        <span className="font-bold text-yellow-300">{player.attributes.agilidade}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Sabedoria">
                        <BookOpen className="w-3 h-3 text-emerald-400" />
                        <span className="font-bold text-emerald-300">{player.attributes.sabedoria}</span>
                    </div>
                    <div className="flex items-center gap-1" title="Carisma">
                        <Heart className="w-3 h-3 text-pink-400" />
                        <span className="font-bold text-pink-300">{player.attributes.carisma}</span>
                    </div>
                </div>
            </div>

            {/* Bottom-center: Controls reminder */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-950/70 backdrop-blur-md px-6 py-3 rounded-full border border-slate-800 shadow-2xl pointer-events-none z-10 opacity-60 hover:opacity-100 transition-opacity flex items-center">
                <p className="text-xs sm:text-sm font-medium text-slate-300">
                    Mova com <kbd className="text-white px-1.5 py-0.5 mx-1 bg-slate-800 rounded font-mono border border-slate-700 text-xs">WASD</kbd>
                    e interaja com <kbd className="text-white px-1.5 py-0.5 mx-1 bg-slate-800 rounded font-mono border border-slate-700 text-xs">ESPAÇO</kbd>
                </p>
            </div>
        </>
    );
}
