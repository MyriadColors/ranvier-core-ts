import { IGameState } from './GameState';
import { Player } from './Player';
import { Room } from './Room';
import { Area } from './Area';
import { Npc } from './Npc';
import { Item } from './Item';

/**
 * Service locator and facade for common Ranvier MUD operations.
 * Provides a unified entry point for interacting with the game state.
 */
export class Ranvier {
	/**
	 * Create a new Ranvier convenience instance.
	 * @param {IGameState} state The global game state
	 */
	constructor(public state: IGameState) {}

	/**
	 * Get a player by name.
	 * @param {string} name
	 * @returns {Player|undefined}
	 */
	getPlayer(name: string): Player | undefined {
		return this.state.PlayerManager.getPlayer(name);
	}

	/**
	 * Get a room by its entity reference (e.g. "area:id").
	 * @param {string} ref
	 * @returns {Room|undefined}
	 */
	getRoom(ref: string): Room | undefined {
		return this.state.RoomManager.getRoom(ref);
	}

	/**
	 * Get an area by name.
	 * @param {string} name
	 * @returns {Area|undefined}
	 */
	getArea(name: string): Area | undefined {
		return this.state.AreaManager.getArea(name);
	}

	/**
	 * Get an NPC by its entity reference or UUID.
	 * @param {string} ref
	 * @returns {Npc|undefined}
	 */
	getNpc(ref: string): Npc | undefined {
		return this.state.MobManager.getMob(ref);
	}

	/**
	 * Get an item by its entity reference or UUID.
	 * @param {string} ref
	 * @returns {Item|undefined}
	 */
	getItem(ref: string): Item | undefined {
		return this.state.ItemManager.getItem(ref);
	}

	/**
	 * Find an entity by reference across multiple managers.
	 * @param {string} ref
	 * @returns {Room|Npc|Item|undefined}
	 */
	findEntity(ref: string): Room | Npc | Item | undefined {
		return this.getRoom(ref) || this.getNpc(ref) || this.getItem(ref);
	}
}
