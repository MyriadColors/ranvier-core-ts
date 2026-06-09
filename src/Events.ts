import type { Character } from './Character';
import type { Item } from './Item';
import type { Room } from './Room';
import type { Area } from './Area';
import type { Effect } from './Effect';
import type { Damage } from './Damage';
import type { Heal } from './Heal';
import type { Quest } from './Quest';
import type { QuestReward } from './QuestReward';
import type { IGameState } from './GameState';

export type EventMap = Record<string | symbol, unknown[]>;

export interface CommonEvents extends EventMap {
	metadataUpdate: [key: string, value: unknown];
	attributeUpdate: [name: string, value: number];
	effectAdded: [effect: Effect];
	effectRemoved: [effect: Effect];
	spawn: [context?: unknown];
	updateTick: [state?: IGameState];
	ready: [];
}

export interface CharacterEvents extends CommonEvents {
	combatStart: [];
	combatantAdded: [target: Character];
	combatantRemoved: [target: Character];
	combatEnd: [];
	equip: [slot: string, item: Item];
	unequip: [slot: string, item: Item];
	followed: [target: Character];
	unfollowed: [following: Character];
	gainedFollower: [follower: Character];
	lostFollower: [follower: Character];
	enterRoom: [room: Room];
	save: [callback?: () => void];
	commandQueued: [index: number];
	channelSend: [channel: unknown, message: string];
	channelReceive: [channel: unknown, sender: Character, message: string];
	hit: [damage: Damage, target: Character, amount: number];
	damaged: [damage: Damage, amount: number];
	heal: [heal: Heal, target: Character, amount: number];
	healed: [heal: Heal, amount: number];
}

export interface ItemEvents extends CommonEvents {
	equip: [equipper: Character];
	unequip: [equipper: Character];
}

export interface RoomEvents extends CommonEvents {
	playerEnter: [player: Character, prevRoom: Room | null];
	playerLeave: [player: Character, nextRoom: Room | null];
	npcEnter: [npc: Character, prevRoom: Room | null];
	npcLeave: [npc: Character, nextRoom: Room | null];
	areaHeal: [heal: Heal, targets: Character[]];
	areaDamage: [damage: Damage, targets: Character[]];
}

export interface AreaEvents extends CommonEvents {
	roomAdded: [room: Room];
	roomRemoved: [room: Room];
}

export interface EffectEvents extends EventMap {
	effectActivated: [];
	effectDeactivated: [];
	effectStackAdded: [effect: Effect];
	effectRefreshed: [effect: Effect];
	effectAdded: [];
	remove: [];
}

export interface QuestEvents extends EventMap {
	start: [];
	progress: [progress: unknown];
	complete: [];
	'turn-in-ready': [];
}

export interface PlayerEvents extends CharacterEvents {
	questProgress: [quest: Quest, progress: unknown];
	questStart: [quest: Quest];
	questTurnInReady: [quest: Quest];
	questComplete: [quest: Quest];
	questReward: [reward: QuestReward];
	saved: [];
}
