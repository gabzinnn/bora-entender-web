import * as Phaser from 'phaser';
import { TILE_SIZE } from './GameTypes';

/**
 * Generates all pixel-art textures for the RPG game.
 * Extracted from the scene to keep it clean.
 */
export function generateAllTextures(scene: Phaser.Scene, shirtColor: number = 0x3b82f6) {
    const g = scene.add.graphics({ x: -2000, y: -2000 });

    // ─── GRASS ─────────────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x10b981, 0.4);
    g.fillRect(8, 8, 4, 12);
    g.fillRect(32, 24, 6, 8);
    g.fillRect(16, 36, 12, 4);
    g.generateTexture('grass', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── GRASS VARIANT (darker) ────────────────────────────────
    g.fillStyle(0x2dd4bf);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x14b8a6, 0.5);
    g.fillRect(4, 20, 8, 4);
    g.fillRect(28, 8, 6, 10);
    g.fillRect(12, 38, 10, 4);
    g.generateTexture('grass2', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── PATH (dirt road) ──────────────────────────────────────
    g.fillStyle(0xd4a76a);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0xc49560, 0.4);
    g.fillRect(6, 10, 8, 4);
    g.fillRect(30, 28, 6, 6);
    g.fillRect(18, 40, 10, 3);
    g.generateTexture('path', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── WATER ─────────────────────────────────────────────────
    g.fillStyle(0x60a5fa);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x3b82f6, 0.5);
    g.fillRect(10, 16, 16, 4);
    g.fillRect(24, 32, 12, 4);
    g.generateTexture('water', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── TREE ──────────────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x78350f);
    g.fillRect(20, 30, 8, 18);
    g.fillStyle(0x065f46);
    g.fillCircle(24, 20, 18);
    g.fillStyle(0x059669);
    g.fillCircle(24, 16, 14);
    g.generateTexture('tree', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── ROCK ──────────────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x6b7280);
    g.fillRoundedRect(8, 18, 32, 24, 8);
    g.fillStyle(0x9ca3af, 0.4);
    g.fillRoundedRect(12, 20, 16, 10, 4);
    g.generateTexture('rock', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── BRIDGE ────────────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0xa16207);
    g.fillRect(0, 10, TILE_SIZE, 28);
    g.fillStyle(0x713f12);
    g.fillRect(0, 14, TILE_SIZE, 2);
    g.fillRect(0, 24, TILE_SIZE, 2);
    g.fillRect(0, 34, TILE_SIZE, 2);
    g.generateTexture('bridge', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── NPC BASE (generic, colored per-type later) ────────────
    const npcTypes: { key: string; bodyColor: number; headColor: number; hatColor?: number }[] = [
        { key: 'npc_math', bodyColor: 0x8b5cf6, headColor: 0xfde047, hatColor: undefined },
        { key: 'npc_geo', bodyColor: 0xf59e0b, headColor: 0xfca5a5, hatColor: 0x451a03 },
        { key: 'npc_sci', bodyColor: 0x06b6d4, headColor: 0xfde68a, hatColor: 0x164e63 },
        { key: 'npc_port', bodyColor: 0xec4899, headColor: 0xfce7f3, hatColor: 0x831843 },
        { key: 'npc_hist', bodyColor: 0x84cc16, headColor: 0xfef3c7, hatColor: 0x365314 },
    ];

    for (const npc of npcTypes) {
        g.fillStyle(0x34d399);
        g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
        // Shadow
        g.fillStyle(0x000000, 0.2);
        g.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 10, 24, 12);
        // Body
        g.fillStyle(npc.bodyColor);
        g.fillRoundedRect(14, 16, 20, 24, 6);
        // Head
        g.fillStyle(npc.headColor);
        g.fillCircle(TILE_SIZE / 2, 14, 10);
        // Eyes
        g.fillStyle(0xffffff, 0.9);
        g.fillCircle(20, 12, 3);
        g.fillCircle(28, 12, 3);
        g.fillStyle(0x1f2937);
        g.fillCircle(20, 12, 1.5);
        g.fillCircle(28, 12, 1.5);
        // Hat
        if (npc.hatColor) {
            g.fillStyle(npc.hatColor);
            g.fillEllipse(TILE_SIZE / 2, 6, 26, 6);
            g.fillRect(18, 0, 12, 6);
        }
        g.generateTexture(npc.key, TILE_SIZE, TILE_SIZE);
        g.clear();
    }

    // ─── GUILD BUILDING ────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE, 16);
    g.fillStyle(0xf59e0b);
    g.fillRect(4, 16, TILE_SIZE - 8, TILE_SIZE - 16);
    g.fillStyle(0xfbbf24);
    g.beginPath(); g.moveTo(0, 16); g.lineTo(TILE_SIZE / 2, 0); g.lineTo(TILE_SIZE, 16); g.fillPath();
    g.fillStyle(0x78350f);
    g.fillRoundedRect(18, 28, 12, 20, 4);
    g.fillStyle(0x10b981);
    g.fillRect(20, 4, 8, 10);
    g.generateTexture('building_guild', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── ARENA BUILDING ────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE, 16);
    g.fillStyle(0x6366f1);
    g.fillRect(4, 16, TILE_SIZE - 8, TILE_SIZE - 16);
    g.fillStyle(0x818cf8);
    g.beginPath(); g.moveTo(0, 16); g.lineTo(TILE_SIZE / 2, 0); g.lineTo(TILE_SIZE, 16); g.fillPath();
    g.fillStyle(0x312e81);
    g.fillRoundedRect(18, 28, 12, 20, 4);
    // Star
    g.fillStyle(0xfde047);
    g.beginPath();
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 6 : 3;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const px = 24 + Math.cos(a) * r;
        const py = 8 + Math.sin(a) * r;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.closePath(); g.fillPath();
    g.generateTexture('building_arena', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── SHOP BUILDING ─────────────────────────────────────────
    g.fillStyle(0x34d399);
    g.fillRect(0, 0, TILE_SIZE, TILE_SIZE);
    g.fillStyle(0x000000, 0.2);
    g.fillEllipse(TILE_SIZE / 2, TILE_SIZE - 4, TILE_SIZE, 16);
    g.fillStyle(0x059669);
    g.fillRect(4, 16, TILE_SIZE - 8, TILE_SIZE - 16);
    g.fillStyle(0x34d399);
    g.beginPath(); g.moveTo(0, 16); g.lineTo(TILE_SIZE / 2, 0); g.lineTo(TILE_SIZE, 16); g.fillPath();
    g.fillStyle(0x064e3b);
    g.fillRoundedRect(18, 28, 12, 20, 4);
    // Coin icon
    g.fillStyle(0xfde047);
    g.fillCircle(24, 8, 6);
    g.fillStyle(0xeab308);
    g.fillCircle(24, 8, 3);
    g.generateTexture('building_shop', TILE_SIZE, TILE_SIZE);
    g.clear();

    // ─── HERO ──────────────────────────────────────────────────
    generateHeroTexture(scene, shirtColor);

    // ─── STAR PARTICLE ─────────────────────────────────────────
    g.fillStyle(0xfde047);
    g.beginPath();
    for (let i = 0; i < 10; i++) {
        const r = i % 2 === 0 ? 8 : 4;
        const a = (i * Math.PI) / 5 - Math.PI / 2;
        const px = 8 + Math.cos(a) * r;
        const py = 8 + Math.sin(a) * r;
        if (i === 0) g.moveTo(px, py); else g.lineTo(px, py);
    }
    g.closePath(); g.fillPath();
    g.generateTexture('starParticle', 16, 16);

    g.destroy();
}

/**
 * Regenerate just the hero texture (for skin changes).
 */
export function generateHeroTexture(scene: Phaser.Scene, shirtColor: number, hairColor: number = 0x1f2937) {
    const g = scene.add.graphics({ x: -2000, y: -2000 });

    // Shadow
    g.fillStyle(0x000000, 0.3);
    g.fillEllipse(16, 30, 20, 8);
    // Legs
    g.fillStyle(0x7e22ce);
    g.fillRoundedRect(6, 14, 20, 14, 4);
    // Body/shirt
    g.fillStyle(shirtColor);
    g.fillRoundedRect(10, 12, 12, 16, 4);
    // Head
    g.fillStyle(0xffedd5);
    g.fillCircle(16, 8, 8);
    // Hair
    g.fillStyle(hairColor);
    g.beginPath();
    g.moveTo(6, 6);
    g.lineTo(16, 0);
    g.lineTo(26, 6);
    g.lineTo(26, 12);
    g.lineTo(6, 12);
    g.fillPath();

    if (scene.textures.exists('hero')) scene.textures.remove('hero');
    g.generateTexture('hero', 32, 32);
    g.destroy();
}
