import { Character } from './Character';
import { Damage } from './Damage';
import { PlayerOrNpc } from './GameEntity';

/**
 * Heal is `Damage` that raises an attribute instead of lowering it
 * @extends Damage
 */
export class Heal extends Damage {
	/**
	 * Raise a given attribute
	 * @param {Character} target
	 * **Fires**: Character#heal
	 * **Fires**: Character#healed
	 */
	commit(target: PlayerOrNpc) {
		const finalAmount = this.evaluate(target);
		target.raiseAttribute(this.attribute, finalAmount);

		if (this.attacker) {
			/**
			 * @event Character#heal
			 * @param {Heal} heal
			 * @param {Character} target
			 * @param {Number} finalAmount
			 */
			(this.attacker as Character).emit('heal', this, target, finalAmount);
		}
		/**
		 * @event Character#healed
		 * @param {Heal} heal
		 * @param {Number} finalAmount
		 */
		(target as Character).emit('healed', this, finalAmount);
	}
}
