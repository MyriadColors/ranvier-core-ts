import { EventEmitter } from 'events';

/**
 * Standard constructor type for mixins
 */
export type Constructor<T = EventEmitter> = new (...args: any[]) => T;

/**
 * Check to see if a given object is iterable
 * @param {unknown} obj
 * @return {boolean}
 */
export function isIterable(obj: unknown): obj is Iterable<unknown> {
	return (
		obj !== null &&
		obj !== undefined &&
		typeof (obj as Iterable<unknown>)[Symbol.iterator] === 'function'
	);
}
