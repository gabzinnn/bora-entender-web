"use client";

import React, { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import * as Phaser from "phaser";
import { RPGScene } from "../engine/RPGScene";
import type { Quest } from "../engine/GameTypes";

export interface PhaserGameRef {
    celebrate: () => void;
    pauseGame: () => void;
    resumeGame: () => void;
    updateHeroColors: (color: number) => void;
}

interface PhaserGameProps {
    quests: Quest[];
    handleInteract: (data: { type: "npc" | "guild" | "arena" | "shop"; questId?: string }) => void;
    handleZoneChange: (zone: string) => void;
    shirtColor?: number;
}

const PhaserGame = forwardRef<PhaserGameRef, PhaserGameProps>((props, ref) => {
    const { quests, handleInteract, handleZoneChange, shirtColor } = props;
    const containerRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);
    const sceneRef = useRef<RPGScene | null>(null);

    useImperativeHandle(ref, () => ({
        celebrate: () => sceneRef.current?.celebrate(),
        pauseGame: () => sceneRef.current?.pauseGame(),
        resumeGame: () => sceneRef.current?.resumeGame(),
        updateHeroColors: (color: number) => sceneRef.current?.updateHeroColors(color),
    }));

    const initializedRef = useRef(false);

    useEffect(() => {
        if (!containerRef.current || initializedRef.current || quests.length === 0) return;

        initializedRef.current = true;
        const scene = new RPGScene(handleInteract, quests, handleZoneChange, shirtColor);
        sceneRef.current = scene;

        const config: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            scale: {
                mode: Phaser.Scale.RESIZE,
                parent: containerRef.current,
                width: "100%",
                height: "100%",
            },
            physics: {
                default: "arcade",
                arcade: { gravity: { x: 0, y: 0 }, debug: false },
            },
            scene,
            transparent: true,
            pixelArt: false,
        };

        phaserGameRef.current = new Phaser.Game(config);

        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);
                phaserGameRef.current = null;
                sceneRef.current = null;
                initializedRef.current = false;
            }
        };
    }, [quests, handleInteract, handleZoneChange]);

    // Update quests independently without restarting the game
    useEffect(() => {
        if (sceneRef.current && quests.length > 0) {
            sceneRef.current.setQuests(quests);
        }
    }, [quests]);

    return <div ref={containerRef} className="w-full h-full" />;
});

PhaserGame.displayName = "PhaserGame";

export default PhaserGame;
