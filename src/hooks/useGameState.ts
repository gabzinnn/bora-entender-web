"use client";

import { useState, useCallback } from "react";
import axios, { AxiosRequestConfig } from "axios";
import type {
    PlayerState,
    Quest,
    SchoolRanking,
    StudentRanking,
    ShopItem,
    ArenaQuestion,
} from "../app/(pages)/rpg/engine/GameTypes";
import api from "@/services/axios";

const API_BASE = "http://localhost:3100";
const PLAYER_ID = "1"; // Mock player ID

export function useGameState() {
    const [player, setPlayer] = useState<PlayerState | null>(null);
    const [quests, setQuests] = useState<Quest[]>([]);
    const [schoolRankings, setSchoolRankings] = useState<SchoolRanking[]>([]);
    const [studentRankings, setStudentRankings] = useState<StudentRanking[]>([]);
    const [shopItems, setShopItems] = useState<ShopItem[]>([]);
    const [arenaQuestions, setArenaQuestions] = useState<ArenaQuestion[]>([]);
    const [loading, setLoading] = useState(false);

    // ─── FETCH HELPERS ───────────────────────────────────────────

    const fetchJson = async (url: string, options?: AxiosRequestConfig) => {
        const res = await api.request({
            url,
            ...options,
            headers: { "Content-Type": "application/json", ...options?.headers },
        });
        return res.data;
    };

    // ─── PLAYER ──────────────────────────────────────────────────

    const fetchPlayer = useCallback(async () => {
        const data = await fetchJson(`/game/player/${PLAYER_ID}`);
        setPlayer(data);
        return data as PlayerState;
    }, []);

    // ─── QUESTS ──────────────────────────────────────────────────

    const fetchQuests = useCallback(async () => {
        const data = await fetchJson(`/game/quests?playerId=${PLAYER_ID}`);
        setQuests(data);
        return data as Quest[];
    }, []);

    const completeQuest = useCallback(
        async (questId: string, acertos: number, totalQuestoes: number) => {
            const data = await fetchJson(`/game/quests/${questId}/complete`, {
                method: "PATCH",
                data: { playerId: PLAYER_ID, acertos, totalQuestoes },
            });
            if (data.player) setPlayer(data.player);
            return data;
        },
        [],
    );

    // ─── RANKINGS ────────────────────────────────────────────────

    const fetchRankings = useCallback(async () => {
        const [schools, students] = await Promise.all([
            fetchJson("/game/ranking/schools"),
            fetchJson("/game/ranking/students"),
        ]);
        setSchoolRankings(schools);
        setStudentRankings(students);
        return { schools, students };
    }, []);

    // ─── SHOP ────────────────────────────────────────────────────

    const fetchShopItems = useCallback(async () => {
        const data = await fetchJson("/game/shop/items");
        setShopItems(data);
        return data as ShopItem[];
    }, []);

    const buyItem = useCallback(async (itemId: string) => {
        const data = await fetchJson("/game/shop/buy", {
            method: "PATCH",
            data: { playerId: PLAYER_ID, itemId },
        });
        if (data.player) setPlayer(data.player);
        return data;
    }, []);

    // ─── SKIN ────────────────────────────────────────────────────

    const updateSkin = useCallback(async (shirtColor: number) => {
        const data = await fetchJson(`/game/player/${PLAYER_ID}/skin`, {
            method: "PATCH",
            data: { playerId: PLAYER_ID, shirtColor },
        });
        setPlayer(data);
        return data;
    }, []);

    // ─── ARENA ───────────────────────────────────────────────────

    const fetchArenaQuestions = useCallback(async (count = 10) => {
        const data = await fetchJson(`/game/arena/questions?count=${count}`);
        setArenaQuestions(data);
        return data as ArenaQuestion[];
    }, []);

    const submitArenaReward = useCallback(
        async (xp: number, coins: number) => {
            const data = await fetchJson(`/game/player/${PLAYER_ID}/reward`, {
                method: "PATCH",
                data: { xp, coins },
            });
            setPlayer(data);
            return data;
        },
        [],
    );

    // ─── INIT ────────────────────────────────────────────────────

    const initGame = useCallback(async () => {
        setLoading(true);
        try {
            await Promise.all([fetchPlayer(), fetchQuests(), fetchShopItems()]);
        } catch (e) {
            console.error("Failed to init game:", e);
        } finally {
            setLoading(false);
        }
    }, [fetchPlayer, fetchQuests, fetchShopItems]);

    return {
        // State
        player,
        quests,
        schoolRankings,
        studentRankings,
        shopItems,
        arenaQuestions,
        loading,
        // Actions
        initGame,
        fetchPlayer,
        fetchQuests,
        fetchRankings,
        fetchShopItems,
        fetchArenaQuestions,
        completeQuest,
        buyItem,
        updateSkin,
        submitArenaReward,
    };
}
