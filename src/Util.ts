import { EventEmitter } from 'events';

export type Constructor<T = EventEmitter> = new (...args: any[]) => T;

/**
 * Check to see if a given object is iterable
 * @param {unknown} obj
 * @return {boolean}
 */
export function isIterable(obj: unknown): obj is Iterable<unknown> {
	return !!(obj && typeof (obj as any)[Symbol.iterator] === 'function');
}
