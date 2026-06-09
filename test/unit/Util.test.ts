import { describe, it, expect } from 'vitest';
import { isIterable } from '../../src/Util';

describe('Util', () => {
  describe('isIterable', () => {
    it('returns true for arrays', () => {
      expect(isIterable([])).toBe(true);
    });
    it('returns true for strings', () => {
      expect(isIterable('test')).toBe(true);
    });
    it('returns true for Map', () => {
      expect(isIterable(new Map())).toBe(true);
    });
    it('returns false for objects', () => {
      // @ts-expect-error
      expect(isIterable({})).toBe(false);
    });
    it('returns false for null/undefined', () => {
      // @ts-expect-error
      expect(isIterable(null)).toBe(false);
      // @ts-expect-error
      expect(isIterable(undefined)).toBe(false);
    });
  });
});
