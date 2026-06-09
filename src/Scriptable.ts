import { BehaviorManager } from './BehaviorManager';
import { EffectableEntity } from './EffectableEntity';
import { PruneableEntity } from './GameEntity';
import { Logger } from './Logger';
import { Constructor } from './Util';

/**
 * @ignore
 * @param {*} parentClass
 * @return {module:ScriptableFn~Scriptable}
 */
export const Scriptable = <TBase extends Constructor<EffectableEntity>>(
	ParentClass: TBase
) =>
	/**
	 * Mixin for entities that can have behaviors attached from a BehaviorManager
	 * @mixin
	 * @alias module:ScriptableFn~Scriptable
	 */
	class extends ParentClass {
		behaviors?: Map<string, unknown>;
		constructor(...args: any[]) {
			super(...args);
		}

		emit(event: string | symbol, ...args: unknown[]) {
			// Squelch events on a pruned entity. Attempts to prevent the case where an entity has been effectively removed
			// from the game but somehow still triggered a listener. Set by respective entity Manager class
			if ((this as PruneableEntity).__pruned) {
				this.removeAllListeners();
				return false;
			}

			return super.emit(event as any, ...args);
		}

		/**
		 * @param {string} name
		 * @return {boolean}
		 */
		hasBehavior(name: string) {
			return this.behaviors?.has(name);
		}

		/**
		 * @param {string} name
		 * @return {T | undefined}
		 */
		getBehavior<T>(name: string): T | undefined {
			return this.behaviors?.get(name) as T;
		}

		/**
		 * Attach this entity's behaviors from the manager
		 * @param {BehaviorManager} manager
		 */
		setupBehaviors(manager: BehaviorManager) {
			if (!this.behaviors) {
				throw new Error('Behaviors are null or undefined.');
			}

			for (const [behaviorName, config] of this.behaviors) {
				const behavior = manager.get(behaviorName);
				if (!behavior) {
					Logger.warn(
						`No script found for [${this.constructor.name}] behavior '${behaviorName}'`
					);
					continue;
				}

				// behavior may be a boolean in which case it will be `behaviorName: true`
				const behaviorConfig = config === true ? {} : (config as object);
				behavior.attach(this, behaviorConfig);
			}
		}
	};
