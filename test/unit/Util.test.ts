import { describe, it, expect } from 'vitest';
import { EventEmitter } from 'events';
import { isIterable, Constructor } from '../../src/Util';

describe('Util', () => {
	describe('isIterable', () => {
		it('returns true for arrays', () => {
			expect(isIterable([])).toBe(true);
			expect(isIterable([1, 2, 3])).toBe(true);
		});

		it('returns true for strings', () => {
			expect(isIterable('test')).toBe(true);
		});

		it('returns true for Map', () => {
			expect(isIterable(new Map())).toBe(true);
		});

		it('returns true for Set', () => {
			expect(isIterable(new Set())).toBe(true);
		});

		it('returns false for objects', () => {
			expect(isIterable({})).toBe(false);
		});

		it('returns false for null/undefined', () => {
			expect(isIterable(null)).toBe(false);
			expect(isIterable(undefined)).toBe(false);
		});

		it('returns false for numbers', () => {
			expect(isIterable(42)).toBe(false);
		});

		it('returns false for booleans', () => {
			expect(isIterable(true)).toBe(false);
			expect(isIterable(false)).toBe(false);
		});
	});

	describe('Constructor', () => {
		it('should allow instantiating with unknown arguments', () => {
			class Base extends EventEmitter {}
			type BaseConstructor = Constructor<Base>;
			class Derived extends Base {
				public name: string;
				public age: number;
				constructor(name: string, age: number) {
					super();
					this.name = name;
					this.age = age;
				}
			}
			const Ctor: BaseConstructor = Derived as any; // Cast as any for now because any[] matches unknown[]
			const instance = new Ctor('Test', 42);
			expect(instance).toBeInstanceOf(Derived);
			expect((instance as Derived).name).toBe('Test');
		});
	});
});
