import { describe, it, expect } from "vitest";
import { isIterable } from "../../src/Util";

describe("Util", () => {
	describe("isIterable", () => {
		it("should return true for arrays", () => {
			expect(isIterable([])).toBe(true);
			expect(isIterable([1, 2, 3])).toBe(true);
		});

		it("should return true for maps", () => {
			expect(isIterable(new Map())).toBe(true);
		});

		it("should return true for sets", () => {
			expect(isIterable(new Set())).toBe(true);
		});

		it("should return true for strings", () => {
			expect(isIterable("test")).toBe(true);
		});

		it("should return false for plain objects", () => {
			// @ts-expect-error
			expect(isIterable({})).toBe(false);
		});

		it("should return false for null/undefined", () => {
			// @ts-expect-error
			expect(isIterable(null)).toBe(false);
			// @ts-expect-error
			expect(isIterable(undefined)).toBe(false);
		});

		it("should return false for numbers/booleans", () => {
			// @ts-expect-error
			expect(isIterable(123)).toBe(false);
			// @ts-expect-error
			expect(isIterable(true)).toBe(false);
		});
	});
});
