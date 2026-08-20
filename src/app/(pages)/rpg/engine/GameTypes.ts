// ─── Shared TypeScript Interfaces for RPG Game Engine ────────────

export interface GameAttributes {
    inteligencia: number;
    agilidade: number;
    sabedoria: number;
    carisma: number;
}

export interface PlayerState {
    id: string;
    name: string;
    level: number;
    xp: number;
    xpToNextLevel: number;
    coins: number;
    hints: number;
    attributes: GameAttributes;
    shirtColor: number;
    equippedItems: string[];
    inventory: string[];
    completedQuests: string[];
    totalQuestsCompleted: number;
    totalCorrectAnswers: number;
}

export interface QuestQuestion {
    id: number;
    enunciado: string;
    alternativas: {
        id: number;
        texto: string;
        correta: boolean;
        justificativa: string;
    }[];
}

export interface Quest {
    id: string;
    title: string;
    npcName: string;
    npcType: 'math' | 'geo' | 'sci' | 'port' | 'hist';
    subject: string;
    description: string;
    dialog: string;
    questions: QuestQuestion[];
    reward: { xp: number; coins: number; attributeBoost?: string };
    videoUrl?: string;
    mapPosition: { x: number; y: number };
    requiredLevel: number;
    zone: string;
    status?: string;
}

export interface SchoolRanking {
    id: string;
    name: string;
    city: string;
    state: string;
    totalXp: number;
    studentCount: number;
    avgLevel: number;
    isCurrentSchool: boolean;
}

export interface StudentRanking {
    id: string;
    name: string;
    school: string;
    level: number;
    xp: number;
    questsCompleted: number;
    isCurrentUser: boolean;
}

export interface ShopItem {
    id: string;
    name: string;
    description: string;
    price: number;
    type: 'hint' | 'skin' | 'equipment';
    icon: string;
    color?: number;
    rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface ArenaQuestion {
    text: string;
    options: string[];
    answer: number;
}

export interface NPCData {
    x: number;
    y: number;
    type: string;
    questId?: string;
    buildingType?: 'guild' | 'arena' | 'shop';
}

export type InteractCallback = (data: {
    type: 'npc' | 'guild' | 'arena' | 'shop';
    questId?: string;
}) => void;

// Map tile types
export const TILE = {
    GRASS: 0,
    WATER: 1,
    TREE: 2,
    NPC: 3,
    GUILD: 5,
    ARENA: 6,
    SHOP: 7,
    BRIDGE: 8,
    PATH: 9,
    ROCK: 10,
} as const;

export const TILE_SIZE = 48;
