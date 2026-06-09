import { describe, it, expect } from 'vitest';
import { isIterable } from '../../src/Util';

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
});
