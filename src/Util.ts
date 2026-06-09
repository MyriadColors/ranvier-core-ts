import { EventEmitter } from 'events';

/**
 * Standard constructor type
 */
// TODO: [Ref] Define specific type for constructor arguments if possible, though any[] is standard for mixins
export type Constructor<T = EventEmitter> = new (...args: any[]) => T;

/**
 * Check to see if a given object is iterable
 */
export function isIterable(obj: unknown): obj is Iterable<unknown> {
  return (
    obj !== null &&
    obj !== undefined &&
    typeof (obj as Iterable<unknown>)[Symbol.iterator] === 'function'
  );
}
