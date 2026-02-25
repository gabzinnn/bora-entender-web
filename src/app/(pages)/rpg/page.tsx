"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { User, School, MessageCircle, Shield, Coins, Star, Trophy, ArrowLeft, Heart, Sparkles, Map } from "lucide-react";
import Link from "next/link";
import * as Phaser from "phaser";

// --- RPG DATA (MOCK) ---
// Let's create a larger, more organic feeling map. Map width = 30, height = 20
// 0: Grass, 1: Water, 2: Trees/Rocks (Obstacles)
// 3: NPC Sábio (Math), 4: NPC Explorador (Geo), 5: Base A, 6: Base B
const MAP_WIDTH = 30;
const MAP_HEIGHT = 20;

const generateMap = () => {
    const map = Array.from({ length: MAP_HEIGHT }, () => Array(MAP_WIDTH).fill(0));

    // Borders (Trees)
    for (let x = 0; x < MAP_WIDTH; x++) {
        map[0][x] = 2; map[MAP_HEIGHT - 1][x] = 2;
    }
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y][0] = 2; map[y][MAP_WIDTH - 1] = 2;
    }

    // A river in the middle
    for (let y = 0; y < MAP_HEIGHT; y++) {
        map[y][10 + Math.floor(Math.sin(y) * 2)] = 1;
        map[y][11 + Math.floor(Math.sin(y) * 2)] = 1;
    }

    // A bridge over the river
    map[10][10 + Math.floor(Math.sin(10) * 2)] = 0;
    map[10][11 + Math.floor(Math.sin(10) * 2)] = 0;
    map[11][10 + Math.floor(Math.sin(11) * 2)] = 0;
    map[11][11 + Math.floor(Math.sin(11) * 2)] = 0;

    // Some random tree clusters
    for (let i = 0; i < 15; i++) {
        const tx = Math.floor(Math.random() * (MAP_WIDTH - 4)) + 2;
        const ty = Math.floor(Math.random() * (MAP_HEIGHT - 4)) + 2;
        if (map[ty][tx] === 0) map[ty][tx] = 2;
        if (map[ty][tx + 1] === 0 && Math.random() > 0.5) map[ty][tx + 1] = 2;
    }

    // POIs
    map[5][5] = 3; // NPC 1
    map[15][20] = 4; // NPC 2
    map[3][25] = 5; // Base A
    map[16][4] = 6; // Base B

    return map;
};

const INITIAL_MAP = generateMap();
const TILE_SIZE = 48;

// --- PHASER SCENE ---
class RPGScene extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private reactInteractCallback: (type: number) => void;
    private interactZones: { x: number, y: number, type: number }[] = [];
    private spaceKey!: Phaser.Input.Keyboard.Key;
    private moveSpeed = 180;
    private particles!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor(reactInteractCallback: (type: number) => void) {
        super({ key: "RPGScene" });
        this.reactInteractCallback = reactInteractCallback;
    }

    preload() {
        const graphics = this.add.graphics({ x: -1000, y: -1000 });

        // Base Grass (0)
        graphics.fillStyle(0x34d399); // Tailwind emerald-400
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        // Add some grass details
        graphics.fillStyle(0x10b981, 0.4); // darker green spots
        graphics.fillRect(8, 8, 4, 12);
        graphics.fillRect(32, 24, 6, 8);
        graphics.fillRect(16, 36, 12, 4);
        graphics.generateTexture('grass', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Water (1)
        graphics.fillStyle(0x60a5fa); // Tailwind blue-400
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.fillStyle(0x3b82f6, 0.5); // darker blue waves
        graphics.fillRect(10, 16, 16, 4);
        graphics.fillRect(24, 32, 12, 4);
        graphics.generateTexture('water', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Trees (2) => Grass background with a tree
        graphics.fillStyle(0x34d399); // Grass BG
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        // Trunk
        graphics.fillStyle(0x78350f); // Amber-900 (wood)
        graphics.fillRect(20, 30, 8, 18);
        // Leaves (Shadow + Highlight)
        graphics.fillStyle(0x065f46); // Emerald-800
        graphics.fillCircle(24, 20, 18);
        graphics.fillStyle(0x059669); // Emerald-600
        graphics.fillCircle(24, 16, 14);
        graphics.generateTexture('tree', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Bridge (Grass BG + Wood)
        graphics.fillStyle(0x34d399);
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.fillStyle(0xa16207); // Brown
        graphics.fillRect(0, 10, TILE_SIZE, 28);
        graphics.fillStyle(0x713f12); // Dark brown lines
        graphics.fillRect(0, 14, TILE_SIZE, 2);
        graphics.fillRect(0, 24, TILE_SIZE, 2);
        graphics.fillRect(0, 34, TILE_SIZE, 2);
        graphics.generateTexture('bridge', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // NPC Math (3)
        graphics.fillStyle(0x34d399); // Grass background
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        // Shadow
        graphics.fillStyle(0x000000, 0.2);
        graphics.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 10, 24, 12);
        // Body & Robe
        graphics.fillStyle(0x8b5cf6); // violet-500
        graphics.fillRoundedRect(14, 16, 20, 24, 8);
        // Head
        graphics.fillStyle(0xfde047); // yellow-300
        graphics.fillCircle(TILE_SIZE / 2, 16, 10);
        // Eyeglasses
        graphics.fillStyle(0xffffff, 0.8);
        graphics.fillCircle(20, 14, 3);
        graphics.fillCircle(28, 14, 3);
        graphics.generateTexture('npcMath', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // NPC Geo (4)
        graphics.fillStyle(0x34d399);
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.fillStyle(0x000000, 0.2); // Shadow
        graphics.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 10, 24, 12);
        graphics.fillStyle(0xf59e0b); // amber-500 (Robe)
        graphics.fillRoundedRect(12, 16, 24, 24, 4);
        graphics.fillStyle(0xfca5a5); // red-300 (Skin)
        graphics.fillCircle(TILE_SIZE / 2, 14, 10);
        // Hat
        graphics.fillStyle(0x451a03); // amber-950
        graphics.fillEllipse(TILE_SIZE / 2, 6, 26, 6);
        graphics.fillRect(18, 0, 12, 6);
        graphics.generateTexture('npcGeo', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Base A (Red) (5)
        graphics.fillStyle(0x34d399); // Grass bg
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.fillStyle(0x000000, 0.2); // Shadow
        graphics.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE, 16);
        // Building structure
        graphics.fillStyle(0xb91c1c); // red-700
        graphics.fillRect(4, 16, TILE_SIZE - 8, TILE_SIZE - 16);
        graphics.fillStyle(0xef4444); // red-500 roof
        graphics.beginPath();
        graphics.moveTo(0, 16);
        graphics.lineTo(TILE_SIZE / 2, 0);
        graphics.lineTo(TILE_SIZE, 16);
        graphics.fillPath();
        // Door
        graphics.fillStyle(0x78350f);
        graphics.fillRoundedRect(18, 28, 12, 20, 4);
        // Flag
        graphics.fillStyle(0xfde047);
        graphics.fillRect(6, 4, 10, 6);
        graphics.generateTexture('baseRed', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Base B (Blue) (6)
        graphics.fillStyle(0x34d399); // Grass bg
        graphics.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        graphics.fillStyle(0x000000, 0.2); // Shadow
        graphics.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE, 16);
        // Building structure
        graphics.fillStyle(0x1d4ed8); // blue-700
        graphics.fillRect(4, 16, TILE_SIZE - 8, TILE_SIZE - 16);
        graphics.fillStyle(0x3b82f6); // blue-500 roof
        graphics.beginPath();
        graphics.moveTo(0, 16);
        graphics.lineTo(TILE_SIZE / 2, 0);
        graphics.lineTo(TILE_SIZE, 16);
        graphics.fillPath();
        // Door
        graphics.fillStyle(0x78350f);
        graphics.fillRoundedRect(18, 28, 12, 20, 4);
        // Flag
        graphics.fillStyle(0xfde047);
        graphics.fillRect(TILE_SIZE - 16, 4, 10, 6);
        graphics.generateTexture('baseBlue', TILE_SIZE, TILE_SIZE);
        graphics.clear();

        // Player Hero
        // Shadow
        graphics.fillStyle(0x000000, 0.3);
        graphics.fillEllipse(16, 30, 20, 8);
        // Backpack
        graphics.fillStyle(0x7e22ce); // purple-700
        graphics.fillRoundedRect(6, 14, 20, 14, 4);
        // Body 
        graphics.fillStyle(0x3b82f6); // blue-500 shirt
        graphics.fillRoundedRect(10, 12, 12, 16, 4);
        // Head
        graphics.fillStyle(0xffedd5); // peach skin
        graphics.fillCircle(16, 8, 8);
        // Hair
        graphics.fillStyle(0x1f2937); // gray-800
        graphics.beginPath();
        graphics.moveTo(6, 6);
        graphics.lineTo(16, 0);
        graphics.lineTo(26, 6);
        graphics.lineTo(26, 12);
        graphics.lineTo(6, 12);
        graphics.fillPath();

        graphics.generateTexture('hero', 32, 32);
        graphics.clear();

        // Particle Star
        graphics.fillStyle(0xfde047);
        graphics.fillStar(8, 8, 5, 4, 8);
        graphics.generateTexture('starParticle', 16, 16);
        graphics.clear();

        // Clean up
        graphics.destroy();
    }

    create() {
        this.cameras.main.setBackgroundColor('#2dd4bf'); // teal-400 map edge color

        const obstacles = this.physics.add.staticGroup();

        // 1. Build Map Environment
        for (let y = 0; y < MAP_HEIGHT; y++) {
            for (let x = 0; x < MAP_WIDTH; x++) {
                const tileType = INITIAL_MAP[y][x];
                const pxX = x * TILE_SIZE + TILE_SIZE / 2;
                const pxY = y * TILE_SIZE + TILE_SIZE / 2;

                let texture = 'grass';
                let isObstacle = false;

                // Context-aware bridge (if water next to grass)
                if (tileType === 0 && (
                    (x > 0 && INITIAL_MAP[y][x - 1] === 1) ||
                    (x < MAP_WIDTH - 1 && INITIAL_MAP[y][x + 1] === 1)
                )) {
                    // Very simplistic handling for bridge visual
                    texture = 'bridge';
                }

                switch (tileType) {
                    case 1: texture = 'water'; isObstacle = true; break;
                    case 2: texture = 'tree'; isObstacle = true; break;
                    case 3: texture = 'npcMath'; this.interactZones.push({ x, y, type: 3 }); isObstacle = true; break;
                    case 4: texture = 'npcGeo'; this.interactZones.push({ x, y, type: 4 }); isObstacle = true; break;
                    case 5: texture = 'baseRed'; this.interactZones.push({ x, y, type: 5 }); isObstacle = true; break;
                    case 6: texture = 'baseBlue'; this.interactZones.push({ x, y, type: 6 }); isObstacle = true; break;
                }

                const tile = this.add.image(pxX, pxY, texture);

                if (isObstacle) {
                    // Shrink obstacle hitbox so we can walk behind things a bit
                    const obs = obstacles.create(pxX, pxY, texture);
                    obs.setAlpha(0);
                    if (tileType === 2) {
                        // Trees: hit only bottom trunk
                        obs.body.setSize(TILE_SIZE * 0.7, TILE_SIZE * 0.4);
                        obs.body.setOffset(TILE_SIZE * 0.15, TILE_SIZE * 0.6);
                    } else if ([3, 4, 5, 6].includes(tileType)) {
                        // NPCs & Bases: solid core
                        obs.body.setSize(TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                        obs.body.setOffset(TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    } else {
                        obs.body.setSize(TILE_SIZE, TILE_SIZE);
                    }
                }
            }
        }

        // 2. Add Player Hero
        this.player = this.physics.add.sprite(
            2 * TILE_SIZE + TILE_SIZE / 2,
            2 * TILE_SIZE + TILE_SIZE / 2,
            'hero'
        );
        this.player.setCollideWorldBounds(true);

        // Smooth circle collision for sliding against walls
        this.player.body.setCircle(10, 6, 12);

        // 3. Collisions & Physics bounds
        this.physics.world.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
        this.physics.add.collider(this.player, obstacles);

        // 4. Camera Follow
        this.cameras.main.setBounds(0, 0, MAP_WIDTH * TILE_SIZE, MAP_HEIGHT * TILE_SIZE);
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // 5. Input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.keyboard.addKeys('W,A,S,D');
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }

        // 6. Celebration Particles Setup
        this.particles = this.add.particles(0, 0, 'starParticle', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            emitting: false
        });
    }

    update() {
        if (!this.cursors || !this.input.keyboard) return;

        const body = this.player.body;
        body.setVelocity(0);

        const keys = this.input.keyboard.keys;
        const w = keys[87]; const a = keys[65];
        const s = keys[83]; const d = keys[68];

        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown || (a && a.isDown)) moveX = -1;
        else if (this.cursors.right.isDown || (d && d.isDown)) moveX = 1;

        if (this.cursors.up.isDown || (w && w.isDown)) moveY = -1;
        else if (this.cursors.down.isDown || (s && s.isDown)) moveY = 1;

        // Normalize diagonal movement using Phaser's built-in Math
        if (moveX !== 0 || moveY !== 0) {
            const vel = new Phaser.Math.Vector2(moveX, moveY).normalize().scale(this.moveSpeed);
            body.setVelocity(vel.x, vel.y);

            // Very simple bobbing animation while walking
            this.player.setAngle(Math.sin(this.time.now / 100) * 10);
        } else {
            this.player.setAngle(0);
        }

        // Interaction Check (Space)
        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.checkInteraction();
        }

        // Depth sorting (Y-sort) so player walks BEHIND trees properly
        this.children.each((child: any) => {
            if (child.y) {
                child.setDepth(child.y);
            }
        });
    }

    checkInteraction() {
        const px = this.player.x;
        const py = this.player.y;
        const tx = Math.floor(px / TILE_SIZE);
        const ty = Math.floor(py / TILE_SIZE);

        // Need to check a slightly larger radius because of tile alignment
        const adjacent = [
            { x: tx, y: ty },
            { x: tx + 1, y: ty }, { x: tx - 1, y: ty },
            { x: tx, y: ty + 1 }, { x: tx, y: ty - 1 },
            { x: tx + 1, y: ty + 1 }, { x: tx - 1, y: ty - 1 },
            { x: tx + 1, y: ty - 1 }, { x: tx - 1, y: ty + 1 },
        ];

        for (const adj of adjacent) {
            const zone = this.interactZones.find(z => z.x === adj.x && z.y === adj.y);
            if (zone) {
                const drx = Math.abs(px - (adj.x * TILE_SIZE + TILE_SIZE / 2));
                const dry = Math.abs(py - (adj.y * TILE_SIZE + TILE_SIZE / 2));

                // A threshold of 64px is about 1.5 tiles reach
                if (drx <= 64 && dry <= 64) {
                    this.reactInteractCallback(zone.type);
                    this.player.setVelocity(0); // slight halt
                    break;
                }
            }
        }
    }

    // Called from React when answer is correct!
    public celebrate() {
        this.particles.emitParticleAt(this.player.x, this.player.y, 15);
    }
}

// --- MOCK DATABASE ---
const questsDB = [
    { type: 3, id: 1, subject: "Matemática", text: "Você encontrou o Sábio das Exatas. Um dragão está bloqueando a ponte, qual é o valor de X na equação: 2x + 10 = 20?", options: ["x = 10", "x = 5", "x = 15", "x = 2"], answer: 1, reward: 80, hint: "Subtraia 10 dos dois lados..." },
    { type: 4, id: 2, subject: "Geografia", text: "O Explorador Ancestral exige conhecimento! Qual destes NÃO é um continente terrestre?", options: ["Europa", "Antártida", "Gronelândia", "Oceania"], answer: 2, reward: 120, hint: "Lembre-se das grandes massas de gelo que pertencem a outros países." },
];


// --- REACT COMPONENT APP ---
export default function RPGModePhaser() {
    const [stats, setStats] = useState({ level: 1, xp: 0, coins: 50, hp: 100 });
    const [interactionModal, setInteractionModal] = useState<null | {
        title: string;
        text: string;
        type: "npc" | "school";
        subject?: string;
        question?: { id: number; text: string; options: string[]; answer: number; reward: number };
    }>(null);

    const [leaderboard, setLeaderboard] = useState([
        { name: "Escola Maple", score: 25500, color: "text-red-400" },
        { name: "Sua Escola", score: 24200, color: "text-indigo-400" },
        { name: "Escola Santa", score: 19800, color: "text-blue-400" },
    ]);

    const gameRef = useRef<HTMLDivElement>(null);
    const phaserGameRef = useRef<Phaser.Game | null>(null);

    // Memoize handleInteract to avoid re-creations breaking Phaser
    const handleInteract = useCallback((type: number) => {
        if (document.getElementById("rpg-modal")) return;

        if (type === 3 || type === 4) {
            const q = questsDB.find(q => q.type === type);
            if (q) {
                setInteractionModal({
                    title: q.subject === "Matemática" ? "O Sábio (Matemática)" : "O Explorador (Geog.)",
                    text: "Prepare-se para o desafio de conhecimento, viajante.",
                    type: "npc",
                    subject: q.subject,
                    question: q
                });
            }
        } else if (type === 5) {
            setInteractionModal({ title: "Portal: Escola Maple (A)", text: "Um território fortificado por estudantes aplicados. Suas bandeiras vermelhas tremulam com o vento da Sabedoria.", type: "school" });
        } else if (type === 6) {
            setInteractionModal({ title: "Portal: Escola Santa (B)", text: "Acampamento costeiro focado em Ciências Humanas. O brasão azul denota paciência e estudo profundo.", type: "school" });
        }
    }, []);

    useEffect(() => {
        if (typeof window !== "undefined" && gameRef.current && !phaserGameRef.current) {
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                // Responsive size for parent container
                scale: {
                    mode: Phaser.Scale.RESIZE,
                    parent: gameRef.current,
                    width: '100%',
                    height: '100%',
                },
                physics: {
                    default: "arcade",
                    arcade: { gravity: { x: 0, y: 0 }, debug: false },
                },
                scene: new RPGScene(handleInteract),
                transparent: true,
                pixelArt: false, // Set to true if using real low-res pixel art
            };

            phaserGameRef.current = new Phaser.Game(config);
        }
        return () => {
            if (phaserGameRef.current) {
                phaserGameRef.current.destroy(true);
                phaserGameRef.current = null;
            }
        };
    }, [handleInteract]);

    useEffect(() => {
        if (!phaserGameRef.current) return;
        const scene = phaserGameRef.current.scene.getScene("RPGScene");
        if (scene) {
            if (interactionModal) {
                scene.input.keyboard?.resetKeys();
                scene.scene.pause();
            } else {
                scene.scene.resume();
            }
        }
    }, [interactionModal]);


    const handleAnswerSubmit = (optionIndex: number) => {
        if (!interactionModal?.question) return;

        if (optionIndex === interactionModal.question.answer) {
            const reward = interactionModal.question.reward;

            // Trigger Phaser Celebration Particles
            if (phaserGameRef.current) {
                const scene = phaserGameRef.current.scene.getScene("RPGScene") as RPGScene;
                if (scene && scene.celebrate) {
                    scene.celebrate();
                }
            }

            setStats(prev => {
                const newXp = prev.xp + reward;
                let newLevel = prev.level;
                if (newXp >= prev.level * 100) newLevel++;
                return { ...prev, level: newLevel, xp: newXp, coins: prev.coins + 25 };
            });

            setLeaderboard(prev =>
                prev.map(l => l.name === "Sua Escola" ? { ...l, score: l.score + reward } : l)
                    .sort((a, b) => b.score - a.score)
            );

            // Play short sound/notification via DOM or simple visual change would go here in full app
        } else {
            // Punish player slightly for wrong answer to maintain RPG tension
            setStats(prev => ({ ...prev, hp: Math.max(0, prev.hp - 10) }));
        }
        setInteractionModal(null);
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans py-6 bg-[url('https://www.transparenttextures.com/patterns/micro-carbon.png')]">

            {/* HEADER TOP NAV */}
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center mb-6">
                <Link href="/" className="flex items-center text-slate-400 hover:text-white transition group bg-slate-800/50 px-4 py-2 rounded-full backdrop-blur-sm border border-slate-700/50">
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Retornar à Tela Padrão
                </Link>
                <div className="flex items-center bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2 rounded-full shadow-lg shadow-indigo-500/20 border border-indigo-400/30">
                    <Shield className="w-5 h-5 mr-3 text-white" />
                    <h1 className="text-xl font-bold tracking-wide">Cloud Quest: Aventura do Saber</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 xl:grid-cols-4 gap-6 h-[80vh]">

                {/* GAME CANVAS (Center Stage) */}
                <div className="xl:col-span-3 bg-slate-800 rounded-[2rem] shadow-2xl relative border border-slate-700 overflow-hidden group">
                    {/* Phaser Canvas Container */}
                    <div ref={gameRef} className="w-full h-full bg-teal-900/30" />

                    {/* UI OVERLAYS INSIDE CANVAS */}
                    <div className="absolute top-6 left-6 right-6 flex justify-between pointer-events-none">
                        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/50 flex items-center shadow-lg">
                            <Map className="w-5 h-5 mr-2 text-teal-400" />
                            <span className="font-semibold text-slate-200">Reino das Questões (Zona Norte)</span>
                        </div>
                        <div className="bg-slate-900/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-slate-700/50 flex space-x-6 shadow-lg">
                            <span className="flex items-center font-bold text-yellow-400"><Coins className="w-5 h-5 mr-1.5" /> {stats.coins} G</span>
                            <span className="flex items-center font-bold text-rose-400"><Heart className="w-5 h-5 mr-1.5" /> {stats.hp} HP</span>
                        </div>
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-slate-900/80 backdrop-blur-md px-6 py-3 rounded-full border border-slate-700 shadow-[0_0_30px_rgba(0,0,0,0.5)] pointer-events-none transition-opacity duration-300 opacity-80 group-hover:opacity-100">
                        <p className="text-sm font-medium text-slate-300 tracking-wide">
                            Use as teclas <span className="text-white px-2 py-1 mx-1 bg-slate-700 rounded-md shadow-inner">W A S D</span> para Explorar • Pressione <span className="text-white px-3 py-1 mx-1 bg-slate-700 rounded-md shadow-inner">Espaço</span> para Interagir
                        </p>
                    </div>
                </div>

                {/* SIDEBAR: STATS & LEADERBOARDS */}
                <div className="xl:col-span-1 flex flex-col space-y-6 overflow-y-auto pr-2 custom-scrollbar">

                    {/* Player Stats Card */}
                    <div className="bg-gradient-to-b from-slate-800 to-slate-800/80 p-6 rounded-3xl border border-slate-700 shadow-xl relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

                        <div className="flex items-center mb-6">
                            <div className="w-14 h-14 bg-gradient-to-br from-indigo-400 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 mr-4">
                                <User className="w-8 h-8 text-white -rotate-3" />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold text-white">Gabriel (Hero)</h2>
                                <p className="text-indigo-300 text-sm font-medium flex items-center">
                                    Nível {stats.level} Mago da Lógica
                                </p>
                            </div>
                        </div>

                        <div className="space-y-5">
                            {/* HP Bar */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    <span>Vitalidade</span>
                                    <span className={stats.hp < 30 ? "text-rose-400" : ""}>{stats.hp} / 100</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-3 shadow-inner">
                                    <div className={`h-3 rounded-full transition-all duration-300 ${stats.hp < 30 ? 'bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)] animate-pulse' : 'bg-gradient-to-r from-emerald-500 to-emerald-400'}`} style={{ width: `${stats.hp}%` }}></div>
                                </div>
                            </div>

                            {/* XP Bar */}
                            <div>
                                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2 uppercase tracking-wider">
                                    <span>Experiência</span>
                                    <span>{stats.xp} / {stats.level * 100}XP</span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-3 shadow-inner relative overflow-hidden">
                                    <div className="absolute inset-0 bg-indigo-500/20 w-full animate-pulse"></div>
                                    <div className="bg-gradient-to-r from-indigo-500 to-purple-500 h-3 rounded-full relative z-10 transition-all duration-700 ease-out" style={{ width: `${Math.min(100, (stats.xp / (stats.level * 100)) * 100)}%` }}></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Guild Leaderboard */}
                    <div className="bg-slate-800 p-6 rounded-3xl border border-slate-700 shadow-xl flex-grow flex flex-col">
                        <h2 className="text-lg font-bold mb-5 flex items-center tracking-wide">
                            <Trophy className="w-5 h-5 mr-3 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />
                            Territórios de Guilda
                        </h2>

                        <div className="space-y-4 flex-grow">
                            {leaderboard.map((item, index) => (
                                <div
                                    key={index}
                                    className={`relative overflow-hidden flex items-center justify-between p-4 rounded-2xl transition-all duration-300 ${item.name === "Sua Escola"
                                            ? "bg-gradient-to-r from-indigo-600/40 to-indigo-900/40 border border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.15)] ring-1 ring-indigo-500/20 hover:-translate-y-1"
                                            : "bg-slate-900/60 border border-transparent hover:border-slate-700 hover:bg-slate-800/80"
                                        }`}
                                >
                                    {/* Rank Badge */}
                                    <div className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mr-4 shadow-inner ${index === 0 ? "bg-gradient-to-br from-yellow-300 to-yellow-600 text-yellow-900" :
                                                index === 1 ? "bg-gradient-to-br from-slate-300 to-slate-500 text-slate-900" :
                                                    index === 2 ? "bg-gradient-to-br from-amber-600 to-amber-800 text-amber-50" :
                                                        "bg-slate-800 text-slate-400"
                                            }`}>
                                            #{index + 1}
                                        </div>
                                        <span className={`font-semibold ${item.name === "Sua Escola" ? "text-white" : "text-slate-300"}`}>
                                            {item.name}
                                        </span>
                                    </div>

                                    <div className="text-right">
                                        <span className={`text-sm font-bold flex items-center justify-end ${item.color}`}>
                                            <Sparkles className="w-3 h-3 mr-1.5 opacity-70" />
                                            {item.score.toLocaleString('pt-BR')}
                                        </span>
                                        <span className="text-[10px] text-slate-500 uppercase font-semibold">Pontos de Conhecimento</span>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-4 pt-4 border-t border-slate-700/50 text-center">
                            <p className="text-xs text-slate-400">Complete Quests no mapa para aumentar a influência da sua guilda!</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* INTERACTIVE RPG MODAL (GLASSMORPHISM) */}
            {interactionModal && (
                <div id="rpg-modal" className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-[100] p-6 animate-in fade-in duration-300">
                    <div className="bg-slate-900/90 border border-slate-700/60 p-8 md:p-10 rounded-[2.5rem] shadow-[0_0_50px_rgba(0,0,0,0.6)] max-w-2xl w-full transform scale-100 animate-in zoom-in-95 duration-300 ring-1 ring-white/10 relative overflow-hidden">

                        {/* Modal Header Decoration */}
                        <div className={`absolute top-0 left-0 w-full h-2 ${interactionModal.type === 'npc' ? 'bg-gradient-to-r from-purple-500 to-indigo-500' : 'bg-gradient-to-r from-amber-500 to-red-500'}`}></div>

                        <div className="flex items-start justify-between mb-8">
                            <div>
                                <div className="flex items-center space-x-3 mb-2">
                                    {interactionModal.subject && (
                                        <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-bold uppercase tracking-wider border border-indigo-500/30">
                                            {interactionModal.subject}
                                        </span>
                                    )}
                                    <span className="px-3 py-1 bg-slate-800 text-slate-400 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-700">
                                        Grau: Desafio
                                    </span>
                                </div>
                                <h3 className="text-3xl font-extrabold text-white tracking-tight flex items-center">
                                    {interactionModal.type === 'npc' ? <MessageCircle className="mr-3 w-8 h-8 text-indigo-400" /> : <School className="mr-3 w-8 h-8 text-amber-500" />}
                                    {interactionModal.title}
                                </h3>
                            </div>
                        </div>

                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/50 mb-8 max-h-[300px] overflow-y-auto custom-scrollbar">
                            <p className="text-slate-300 text-lg leading-relaxed italic border-l-4 border-indigo-500/50 pl-4">
                                "{interactionModal.text}"
                            </p>
                        </div>

                        {interactionModal.question && (
                            <div className="bg-slate-950/50 p-8 rounded-3xl border border-indigo-900/30 shadow-inner mb-8 transition-all hover:border-indigo-500/30">
                                <p className="text-xl font-semibold mb-8 text-white leading-tight">
                                    {interactionModal.question.text}
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {interactionModal.question.options.map((opt, i) => (
                                        <button
                                            key={i}
                                            onClick={() => handleAnswerSubmit(i)}
                                            // Complex hover/active states for that premium feel
                                            className="group relative px-6 py-5 bg-gradient-to-b from-slate-800 to-slate-900 hover:from-indigo-600 hover:to-indigo-700 border border-slate-700 hover:border-indigo-400 rounded-2xl transition-all duration-200 text-left font-medium text-lg text-slate-200 hover:text-white hover:-translate-y-1 hover:shadow-[0_10px_20px_rgba(79,70,229,0.3)] overflow-hidden"
                                        >
                                            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-600 group-hover:bg-indigo-300 transition-colors"></span>
                                            <span className="ml-2 relative z-10">{String.fromCharCode(65 + i)}) {opt}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 border-t border-slate-800">
                            <button
                                onClick={() => setInteractionModal(null)}
                                className="px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold transition-all hover:text-white border border-slate-700 hover:border-slate-500 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-offset-2 focus:ring-offset-slate-900"
                            >
                                {interactionModal.question ? "Fugir do Desafio" : "Explorar Outro Local"}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Global overrides for scrollbar just for this page's elements */}
            <style dangerouslySetInnerHTML={{
                __html: `
        .custom-scrollbar::-webkit-scrollbar {
            width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(30, 41, 59, 0.5);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(71, 85, 105, 0.8);
            border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(100, 116, 139, 1);
        }
      `}} />
        </div>
    );
}
