"use client";

import React from "react";
import { ShoppingBag, Coins, Sparkles, Check, Crown, Star } from "lucide-react";
import type { ShopItem, PlayerState } from "../engine/GameTypes";

interface ShopModalProps {
    player: PlayerState;
    items: ShopItem[];
    onBuy: (itemId: string) => Promise<{ success: boolean; message: string }>;
    onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
    common: "border-slate-700 bg-slate-800/30",
    rare: "border-blue-500/30 bg-blue-900/10",
    epic: "border-purple-500/30 bg-purple-900/10",
    legendary: "border-amber-500/30 bg-amber-900/10",
};

const RARITY_BADGE: Record<string, string> = {
    common: "text-slate-400",
    rare: "text-blue-400",
    epic: "text-purple-400",
    legendary: "text-amber-400",
};

export default function ShopModal({ player, items, onBuy, onClose }: ShopModalProps) {
    const [buying, setBuying] = React.useState<string | null>(null);
    const [message, setMessage] = React.useState<string>("");

    const handleBuy = async (itemId: string) => {
        setBuying(itemId);
        setMessage("");
        const res = await onBuy(itemId);
        setMessage(res.message);
        setBuying(null);
        setTimeout(() => setMessage(""), 3000);
    };

    const owned = player.inventory;

    return (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-[100] p-4 sm:p-6 animate-in fade-in duration-200">
            <div className="bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-950/50">
                    <h2 className="text-xl font-bold flex items-center text-emerald-400">
                        <ShoppingBag className="w-6 h-6 mr-2.5" /> Loja do Aventureiro
                    </h2>
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1.5 text-yellow-400 font-bold bg-slate-800 px-3 py-1 rounded-full text-sm">
                            <Coins className="w-4 h-4" /> {player.coins}G
                        </span>
                        <button onClick={onClose} className="px-5 py-2 bg-slate-800 hover:bg-slate-700 rounded-full text-sm font-bold text-slate-300 transition">
                            Sair
                        </button>
                    </div>
                </div>

                {/* Message toast */}
                {message && (
                    <div className="mx-5 mt-4 p-3 rounded-xl bg-indigo-900/30 border border-indigo-500/30 text-sm text-indigo-300 font-medium text-center animate-in fade-in duration-300">
                        {message}
                    </div>
                )}

                {/* Items grid */}
                <div className="p-5 overflow-y-auto flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {items.map((item) => {
                            const isOwned = owned.includes(item.id);
                            const canAfford = player.coins >= item.price;

                            return (
                                <div
                                    key={item.id}
                                    className={`rounded-2xl border p-4 transition-all ${RARITY_COLORS[item.rarity]} ${isOwned ? "opacity-60" : ""}`}
                                >
                                    <div className="flex items-start justify-between mb-3">
                                        <span className="text-2xl">{item.icon}</span>
                                        <span className={`text-[10px] font-bold uppercase ${RARITY_BADGE[item.rarity]}`}>
                                            {item.rarity === "common" ? "Comum"
                                                : item.rarity === "rare" ? "Raro"
                                                    : item.rarity === "epic" ? "Épico"
                                                        : "Lendário"}
                                        </span>
                                    </div>

                                    <h3 className="text-sm font-bold text-white mb-1">{item.name}</h3>
                                    <p className="text-xs text-slate-400 mb-4 leading-relaxed">{item.description}</p>

                                    <div className="flex items-center justify-between">
                                        <span className="flex items-center gap-1 text-yellow-400 font-bold text-sm">
                                            <Coins className="w-3.5 h-3.5" /> {item.price}G
                                        </span>

                                        {isOwned ? (
                                            <span className="flex items-center gap-1 text-emerald-400 text-xs font-bold">
                                                <Check className="w-3.5 h-3.5" /> Adquirido
                                            </span>
                                        ) : (
                                            <button
                                                onClick={() => handleBuy(item.id)}
                                                disabled={!canAfford || buying === item.id}
                                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${canAfford
                                                        ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                                        : "bg-slate-800 text-slate-600 cursor-not-allowed"
                                                    }`}
                                            >
                                                {buying === item.id ? "..." : "Comprar"}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
