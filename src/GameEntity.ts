import { Area } from './Area';
import { Character } from './Character';
import { EffectableEntity } from './EffectableEntity';
import { IItemDef, Item } from './Item';
import { Metadatable } from './Metadatable';
import { INpcDef, Npc } from './Npc';
import { Player } from './Player';
import { IRoomDef, Room } from './Room';
import { Scriptable } from './Scriptable';
import { EventMap } from './Events';

/**
 * @extends EventEmitter
 * **Mixes**: Metadatable
 * **Mixes**: Scriptable
 */
export class GameEntity<Events extends EventMap = EventMap> extends Scriptable(
	Metadatable(EffectableEntity)
) {
	emit<K extends keyof Events>(event: K, ...args: Events[K]): boolean;
	emit(event: string | symbol, ...args: unknown[]): boolean {
		return super.emit(event as any, ...args);
	}
}

export type PlayerOrNpc = Player | Npc;
export type AnyCharacter = PlayerOrNpc | Character;
export type GameEntities = Item | Npc | Room;
export type AnyGameEntity = Item | Npc | Room | Area | Player;
export type GameEntityDefinition = IItemDef | INpcDef | IRoomDef;

export interface PruneableEntity {
	__pruned?: boolean;
}
