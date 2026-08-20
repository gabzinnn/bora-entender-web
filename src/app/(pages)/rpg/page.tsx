"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";

// Types
import type { Quest } from "./engine/GameTypes";
import type { PhaserGameRef } from "./components/PhaserGame";

// UI Components
const PhaserGame = dynamic(() => import("./components/PhaserGame"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
        </div>
    ),
});

import GameHUD from "./components/GameHUD";
import QuestModal from "./components/QuestModal";
import GuildModal from "./components/GuildModal";
import ArenaModal from "./components/ArenaModal";
import ShopModal from "./components/ShopModal";

// Data Hook
import { useGameState } from "../../../hooks/useGameState";

export default function RPGPage() {
    const phaserGameRef = useRef<PhaserGameRef>(null);

    const [zoneName, setZoneName] = useState("Vila Inicial");
    const [activeModal, setActiveModal] = useState<
        | null
        | { type: "quest"; quest: Quest }
        | { type: "guild" }
        | { type: "arena" }
        | { type: "shop" }
    >(null);

    const activeModalRef = useRef(activeModal);
    activeModalRef.current = activeModal;

    const {
        player,
        quests,
        schoolRankings,
        studentRankings,
        shopItems,
        loading,
        initGame,
        fetchRankings,
        fetchArenaQuestions,
        completeQuest,
        buyItem,
        updateSkin,
        submitArenaReward,
    } = useGameState();

    const questsRef = useRef(quests);
    questsRef.current = quests;

    // ─── INTERACTION CALLBACK ──────────────────────────────────

    const handleInteract = useCallback(
        (data: { type: "npc" | "guild" | "arena" | "shop"; questId?: string }) => {
            if (activeModalRef.current) return; // Already showing modal

            if (data.type === "npc" && data.questId) {
                const quest = questsRef.current.find((q) => q.id === data.questId);
                if (quest) {
                    setActiveModal({ type: "quest", quest });
                }
            } else if (data.type === "guild") {
                setActiveModal({ type: "guild" });
            } else if (data.type === "arena") {
                setActiveModal({ type: "arena" });
            } else if (data.type === "shop") {
                setActiveModal({ type: "shop" });
            }
        },
        [],
    );

    const handleZoneChange = useCallback((zone: string) => {
        setZoneName(zone);
    }, []);

    // ─── INIT GAME ─────────────────────────────────────────────

    useEffect(() => {
        initGame();
    }, [initGame]);

    // ─── PAUSE/RESUME PHASER WHEN MODAL CHANGES ───────────────

    useEffect(() => {
        if (!phaserGameRef.current) return;
        if (activeModal) {
            phaserGameRef.current.pauseGame();
        } else {
            phaserGameRef.current.resumeGame();
        }
    }, [activeModal]);

    // ─── MODAL HANDLERS ────────────────────────────────────────

    const closeModal = () => setActiveModal(null);

    const handleQuestComplete = async (acertos: number, total: number) => {
        if (activeModal?.type === "quest") {
            await completeQuest(activeModal.quest.id, acertos, total);
            phaserGameRef.current?.celebrate();
        }
        closeModal();
    };

    const handleSkinChange = (color: number) => {
        updateSkin(color);
        phaserGameRef.current?.updateHeroColors(color);
    };

    const handleBuyItem = async (itemId: string) => {
        const res = await buyItem(itemId);
        if (res.success) {
            phaserGameRef.current?.celebrate();
        }
        return res;
    };

    // ─── DEBUG CHEATS ──────────────────────────────────────────

    useEffect(() => {
        if (typeof window !== "undefined") {
            (window as any).addCoins = (n: number) => submitArenaReward(0, n);
            (window as any).addXP = (n: number) => submitArenaReward(n, 0);
        }
    }, [submitArenaReward]);

    // ─── RENDER ────────────────────────────────────────────────

    return (
        <div className="min-h-screen bg-slate-950 text-white font-sans overflow-hidden">
            {/* Loading Overlay */}
            {(loading || !player) && (
                <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-50">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-10 h-10 text-indigo-500 animate-spin" />
                        <p className="text-slate-400 font-medium">Carregando o Reino das Questões...</p>
                    </div>
                </div>
            )}

            {/* Top bar */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
                <Link
                    href="/"
                    className="flex items-center text-slate-400 hover:text-white transition group bg-slate-900/50 px-4 py-2 rounded-full border border-slate-800"
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Voltar
                </Link>
            </div>

            {/* Game Canvas */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 h-[85vh]">
                <div className="w-full h-full bg-slate-900 rounded-3xl shadow-2xl relative border border-slate-800 overflow-hidden">
                    {/* Phaser Game Component - Client side only */}
                    <PhaserGame
                        ref={phaserGameRef}
                        quests={quests}
                        handleInteract={handleInteract}
                        handleZoneChange={handleZoneChange}
                        shirtColor={player?.shirtColor}
                    />

                    {/* HUD Overlay */}
                    {player && <GameHUD player={player} zoneName={zoneName} />}
                </div>
            </div>

            {/* ─── MODALS ─────────────────────────────────────────── */}

            {activeModal?.type === "quest" && player && (
                <QuestModal
                    quest={activeModal.quest}
                    hints={player.hints}
                    onComplete={handleQuestComplete}
                    onClose={closeModal}
                />
            )}

            {activeModal?.type === "guild" && player && (
                <GuildModal
                    player={player}
                    schoolRankings={schoolRankings}
                    studentRankings={studentRankings}
                    onSkinChange={handleSkinChange}
                    onClose={closeModal}
                    onFetchRankings={fetchRankings}
                />
            )}

            {activeModal?.type === "arena" && (
                <ArenaModal
                    onFetchQuestions={fetchArenaQuestions}
                    onSubmitReward={submitArenaReward}
                    onCelebrate={() => phaserGameRef.current?.celebrate()}
                    onClose={closeModal}
                />
            )}

            {activeModal?.type === "shop" && player && (
                <ShopModal
                    player={player}
                    items={shopItems}
                    onBuy={handleBuyItem}
                    onClose={closeModal}
                />
            )}
        </div>
    );
}
