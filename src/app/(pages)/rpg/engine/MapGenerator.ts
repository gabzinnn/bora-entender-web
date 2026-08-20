import { TILE, TILE_SIZE } from './GameTypes';
import type { Quest, NPCData } from './GameTypes';

const MAP_WIDTH = 40;
const MAP_HEIGHT = 30;

export { MAP_WIDTH, MAP_HEIGHT };

/**
 * Generates the game world map with 4 themed zones, NPCs, buildings, and obstacles.
 * Returns: { tiles: number[][], npcs: NPCData[] }
 */
export function generateWorldMap(quests: Quest[]) {
    const tiles: number[][] = Array.from({ length: MAP_HEIGHT }, () =>
        Array(MAP_WIDTH).fill(TILE.GRASS),
    );

    const npcs: NPCData[] = [];

    // ─── ZONE BOUNDARIES (water rivers) ────────────────────────
    // Vertical river at x=18-19 (separates west/east)
    for (let y = 0; y < MAP_HEIGHT; y++) {
        if (y >= 12 && y <= 14) continue; // bridge gap
        tiles[y][18] = TILE.WATER;
        tiles[y][19] = TILE.WATER;
    }
    // Bridge over the vertical river
    for (let y = 12; y <= 14; y++) {
        tiles[y][18] = TILE.BRIDGE;
        tiles[y][19] = TILE.BRIDGE;
    }

    // Horizontal river at y=14-15 (separates north/south) — west side
    for (let x = 0; x < 18; x++) {
        if (x >= 8 && x <= 10) continue; // bridge gap
        tiles[14][x] = TILE.WATER;
        tiles[15][x] = TILE.WATER;
    }
    // Bridge over horizontal river
    for (let x = 8; x <= 10; x++) {
        tiles[14][x] = TILE.BRIDGE;
        tiles[15][x] = TILE.BRIDGE;
    }

    // Horizontal river at y=14-15 (separates north/south) — east side
    for (let x = 20; x < MAP_WIDTH; x++) {
        if (x >= 28 && x <= 30) continue; // bridge gap
        tiles[14][x] = TILE.WATER;
        tiles[15][x] = TILE.WATER;
    }
    // Bridge over horizontal river (east side)
    for (let x = 28; x <= 30; x++) {
        tiles[14][x] = TILE.BRIDGE;
        tiles[15][x] = TILE.BRIDGE;
    }

    // ─── BORDER WALLS (trees) ──────────────────────────────────
    for (let x = 0; x < MAP_WIDTH; x++) {
        tiles[0][x] = TILE.TREE;
        tiles[MAP_HEIGHT - 1][x] = TILE.TREE;
    }
    for (let y = 0; y < MAP_HEIGHT; y++) {
        tiles[y][0] = TILE.TREE;
        tiles[y][MAP_WIDTH - 1] = TILE.TREE;
    }

    // ─── SCATTERED TREES AND ROCKS ─────────────────────────────
    const seededRandom = (seed: number) => {
        let s = seed;
        return () => {
            s = (s * 1664525 + 1013904223) & 0xffffffff;
            return (s >>> 0) / 0xffffffff;
        };
    };
    const rng = seededRandom(12345);

    // Zone 1: Vila Inicial (NW: y 1-13, x 1-17)
    for (let i = 0; i < 8; i++) {
        const tx = Math.floor(rng() * 14) + 2;
        const ty = Math.floor(rng() * 10) + 2;
        if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.TREE;
    }

    // Zone 2: Floresta do Saber (NE: y 1-13, x 20-38)
    for (let i = 0; i < 14; i++) {
        const tx = Math.floor(rng() * 16) + 21;
        const ty = Math.floor(rng() * 10) + 2;
        if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.TREE;
    }

    // Zone 3: Montanha dos Números (SW: y 16-28, x 1-17)
    for (let i = 0; i < 6; i++) {
        const tx = Math.floor(rng() * 14) + 2;
        const ty = Math.floor(rng() * 10) + 17;
        if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.ROCK;
    }
    for (let i = 0; i < 5; i++) {
        const tx = Math.floor(rng() * 14) + 2;
        const ty = Math.floor(rng() * 10) + 17;
        if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.TREE;
    }

    // Zone 4: Lago da Sabedoria (SE: y 16-28, x 20-38)
    // Small lake
    for (let dy = 0; dy < 3; dy++) {
        for (let dx = 0; dx < 4; dx++) {
            tiles[22 + dy][30 + dx] = TILE.WATER;
        }
    }
    for (let i = 0; i < 6; i++) {
        const tx = Math.floor(rng() * 16) + 21;
        const ty = Math.floor(rng() * 10) + 17;
        if (tiles[ty][tx] === TILE.GRASS) tiles[ty][tx] = TILE.TREE;
    }

    // ─── DIRT PATHS ────────────────────────────────────────────
    // Path from spawn to center
    for (let x = 3; x <= 17; x++) {
        if (tiles[7][x] === TILE.GRASS) tiles[7][x] = TILE.PATH;
    }
    for (let y = 3; y <= 13; y++) {
        if (tiles[y][9] === TILE.GRASS) tiles[y][9] = TILE.PATH;
    }

    // ─── BUILDINGS ─────────────────────────────────────────────
    // Guild in Vila Inicial
    const guildPos = { x: 7, y: 4 };
    tiles[guildPos.y][guildPos.x] = TILE.GUILD;
    npcs.push({ x: guildPos.x, y: guildPos.y, type: 'guild', buildingType: 'guild' });

    // Arena in Montanha dos Números
    const arenaPos = { x: 8, y: 20 };
    tiles[arenaPos.y][arenaPos.x] = TILE.ARENA;
    npcs.push({ x: arenaPos.x, y: arenaPos.y, type: 'arena', buildingType: 'arena' });

    // Shop in Vila Inicial
    const shopPos = { x: 12, y: 5 };
    tiles[shopPos.y][shopPos.x] = TILE.SHOP;
    npcs.push({ x: shopPos.x, y: shopPos.y, type: 'shop', buildingType: 'shop' });

    // ─── NPCs (from quests) ────────────────────────────────────
    for (const quest of quests) {
        const { x, y } = quest.mapPosition;
        if (x > 0 && x < MAP_WIDTH - 1 && y > 0 && y < MAP_HEIGHT - 1) {
            tiles[y][x] = TILE.NPC;
            npcs.push({
                x,
                y,
                type: quest.npcType,
                questId: quest.id,
            });
        }
    }

    return { tiles, npcs, width: MAP_WIDTH, height: MAP_HEIGHT };
}

/**
 * Get the zone name for a given tile position.
 */
export function getZoneName(tileX: number, tileY: number): string {
    if (tileX < 18 && tileY < 14) return 'Vila Inicial';
    if (tileX >= 20 && tileY < 14) return 'Floresta do Saber';
    if (tileX < 18 && tileY >= 16) return 'Montanha dos Números';
    if (tileX >= 20 && tileY >= 16) return 'Lago da Sabedoria';
    return 'Ponte'; // On river bridges
}

/**
 * Get the texture key for a tile type.
 */
export function getTextureForTile(
    tileType: number,
    npcData?: NPCData,
): string {
    switch (tileType) {
        case TILE.WATER: return 'water';
        case TILE.TREE: return 'tree';
        case TILE.ROCK: return 'rock';
        case TILE.BRIDGE: return 'bridge';
        case TILE.PATH: return 'path';
        case TILE.GUILD: return 'building_guild';
        case TILE.ARENA: return 'building_arena';
        case TILE.SHOP: return 'building_shop';
        case TILE.NPC:
            if (npcData) return `npc_${npcData.type}`;
            return 'npc_math';
        default: return 'grass';
    }
}
