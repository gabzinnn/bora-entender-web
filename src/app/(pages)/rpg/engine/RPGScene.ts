import * as Phaser from 'phaser';
import { TILE, TILE_SIZE } from './GameTypes';
import type { Quest, InteractCallback, NPCData } from './GameTypes';
import { generateAllTextures, generateHeroTexture } from './TextureGenerator';
import {
    generateWorldMap,
    getTextureForTile,
    getZoneName,
    MAP_WIDTH,
    MAP_HEIGHT,
} from './MapGenerator';

interface MapData {
    tiles: number[][];
    npcs: NPCData[];
    width: number;
    height: number;
}

export class RPGScene extends Phaser.Scene {
    private player!: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody;
    private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
    private spaceKey!: Phaser.Input.Keyboard.Key;
    private moveSpeed = 200;
    private particles!: Phaser.GameObjects.Particles.ParticleEmitter;
    private shirtColor = 0x3b82f6;

    // External data
    private quests: Quest[] = [];
    private mapData!: MapData;
    private interactCallback: InteractCallback;
    private zoneChangeCallback?: (zone: string) => void;
    private currentZone = '';

    // Map tracking
    private npcsOnMap: NPCData[] = [];
    private isPaused = false;

    constructor(
        interactCallback: InteractCallback,
        quests: Quest[] = [],
        zoneChangeCallback?: (zone: string) => void,
        shirtColor: number = 0x3b82f6,
    ) {
        super({ key: 'RPGScene' });
        this.interactCallback = interactCallback;
        this.quests = quests;
        this.zoneChangeCallback = zoneChangeCallback;
        this.shirtColor = shirtColor;
    }

    public setQuests(quests: Quest[]) {
        this.quests = quests;
    }

    public updateHeroColors(shirtColor: number) {
        this.shirtColor = shirtColor;
        generateHeroTexture(this, shirtColor);
        if (this.player) {
            // Force texture refresh: set to something else then back to 'hero'
            // because Phaser returns early if the texture key is the same.
            this.player.setTexture('__BASE');
            this.player.setTexture('hero');
        }
    }

    preload() {
        generateAllTextures(this, this.shirtColor);
    }

    create() {
        this.cameras.main.setBackgroundColor('#2dd4bf');

        // Generate map from quest data
        this.mapData = generateWorldMap(this.quests);
        this.npcsOnMap = this.mapData.npcs;

        const obstacles = this.physics.add.staticGroup();

        for (let y = 0; y < this.mapData.height; y++) {
            for (let x = 0; x < this.mapData.width; x++) {
                const tileType = this.mapData.tiles[y][x];
                const pxX = x * TILE_SIZE + TILE_SIZE / 2;
                const pxY = y * TILE_SIZE + TILE_SIZE / 2;

                // Find NPC data for this position
                const npcData = this.npcsOnMap.find((n) => n.x === x && n.y === y);
                const texture = getTextureForTile(tileType, npcData);
                const isObstacle = tileType !== TILE.GRASS && tileType !== TILE.BRIDGE && tileType !== TILE.PATH;

                const tile = this.add.image(pxX, pxY, texture);

                if (isObstacle) {
                    // Obstacle tiles get Y-based depth in a mid range
                    tile.setDepth(pxY + 1000);

                    const obs = obstacles.create(pxX, pxY, texture) as Phaser.Physics.Arcade.Sprite;
                    obs.setAlpha(0);

                    if (tileType === TILE.TREE) {
                        obs.body!.setSize(TILE_SIZE * 0.7, TILE_SIZE * 0.4);
                        obs.body!.setOffset(TILE_SIZE * 0.15, TILE_SIZE * 0.6);
                    } else if (tileType === TILE.ROCK) {
                        obs.body!.setSize(TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                        obs.body!.setOffset(TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    } else if (
                        tileType === TILE.NPC ||
                        tileType === TILE.GUILD ||
                        tileType === TILE.ARENA ||
                        tileType === TILE.SHOP
                    ) {
                        obs.body!.setSize(TILE_SIZE * 0.8, TILE_SIZE * 0.5);
                        obs.body!.setOffset(TILE_SIZE * 0.1, TILE_SIZE * 0.5);
                    } else {
                        obs.body!.setSize(TILE_SIZE, TILE_SIZE);
                    }
                } else {
                    // Terrain tiles stay at a fixed low depth
                    tile.setDepth(0);
                }
            }
        }

        // Player
        this.player = this.physics.add.sprite(
            3 * TILE_SIZE + TILE_SIZE / 2,
            3 * TILE_SIZE + TILE_SIZE / 2,
            'hero',
        );
        this.player.setCollideWorldBounds(true);
        this.player.body.setCircle(10, 6, 12);

        this.physics.world.setBounds(
            0, 0,
            this.mapData.width * TILE_SIZE,
            this.mapData.height * TILE_SIZE,
        );
        this.physics.add.collider(this.player, obstacles);

        // Camera
        this.cameras.main.setBounds(
            0, 0,
            this.mapData.width * TILE_SIZE,
            this.mapData.height * TILE_SIZE,
        );
        this.cameras.main.startFollow(this.player, true, 0.08, 0.08);

        // Input
        if (this.input.keyboard) {
            this.cursors = this.input.keyboard.createCursorKeys();
            this.input.keyboard.addKeys('W,A,S,D');
            this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        }

        // Particles
        this.particles = this.add.particles(0, 0, 'starParticle', {
            speed: { min: 50, max: 150 },
            angle: { min: 0, max: 360 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            emitting: false,
        });
        this.particles.setDepth(5000);
    }

    update() {
        if (!this.cursors || !this.input || !this.input.keyboard || this.isPaused) return;

        const body = this.player.body;
        body.setVelocity(0);

        const keys = this.input.keyboard.keys;
        const w = keys[87]; // W
        const a = keys[65]; // A
        const s = keys[83]; // S
        const d = keys[68]; // D

        let moveX = 0;
        let moveY = 0;

        if (this.cursors.left.isDown || (a && a.isDown)) moveX = -1;
        else if (this.cursors.right.isDown || (d && d.isDown)) moveX = 1;

        if (this.cursors.up.isDown || (w && w.isDown)) moveY = -1;
        else if (this.cursors.down.isDown || (s && s.isDown)) moveY = 1;

        if (moveX !== 0 || moveY !== 0) {
            const vel = new Phaser.Math.Vector2(moveX, moveY).normalize().scale(this.moveSpeed);
            body.setVelocity(vel.x, vel.y);
            this.player.setAngle(Math.sin(this.time.now / 100) * 10);
        } else {
            this.player.setAngle(0);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
            this.checkInteraction();
        }

        // Player depth: always above terrain
        this.player.setDepth(this.player.y + 2000);

        // Zone detection
        const tx = Math.floor(this.player.x / TILE_SIZE);
        const ty = Math.floor(this.player.y / TILE_SIZE);
        const newZone = getZoneName(tx, ty);
        if (newZone !== this.currentZone) {
            this.currentZone = newZone;
            this.zoneChangeCallback?.(newZone);
        }
    }

    private checkInteraction() {
        const px = this.player.x;
        const py = this.player.y;
        const tx = Math.floor(px / TILE_SIZE);
        const ty = Math.floor(py / TILE_SIZE);

        const adjacent = [
            { x: tx, y: ty },
            { x: tx + 1, y: ty },
            { x: tx - 1, y: ty },
            { x: tx, y: ty + 1 },
            { x: tx, y: ty - 1 },
            { x: tx + 1, y: ty + 1 },
            { x: tx - 1, y: ty - 1 },
            { x: tx + 1, y: ty - 1 },
            { x: tx - 1, y: ty + 1 },
        ];

        for (const adj of adjacent) {
            const npc = this.npcsOnMap.find((n) => n.x === adj.x && n.y === adj.y);
            if (npc) {
                const drx = Math.abs(px - (adj.x * TILE_SIZE + TILE_SIZE / 2));
                const dry = Math.abs(py - (adj.y * TILE_SIZE + TILE_SIZE / 2));
                if (drx <= 64 && dry <= 64) {
                    if (npc.buildingType) {
                        this.interactCallback({ type: npc.buildingType });
                    } else if (npc.questId) {
                        this.interactCallback({ type: 'npc', questId: npc.questId });
                    }
                    this.player.setVelocity(0, 0);
                    break;
                }
            }
        }
    }

    public celebrate() {
        this.particles.emitParticleAt(this.player.x, this.player.y, 25);
    }

    public pauseGame() {
        this.isPaused = true;
        this.player?.setVelocity(0, 0);
        if (this.input && this.input.keyboard) {
            this.input.keyboard.resetKeys();
        }
    }

    public resumeGame() {
        this.isPaused = false;
    }
}
