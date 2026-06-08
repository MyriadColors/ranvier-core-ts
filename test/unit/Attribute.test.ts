import { describe, it, expect, beforeEach } from "vitest";
import { Attribute } from "../../src/Attribute";

describe("Basic Attribute", () => {
	let attribute: Attribute;
	const base = 10;
	beforeEach(() => {
		attribute = new Attribute("test", base);
	});

	describe("#setBase", () => {
		it("should update base value", () => {
			expect(attribute.base).toBe(base);
			attribute.setBase(50);
			expect(attribute.base).toBe(50);
		});

		it("should not allow negative base", () => {
			attribute.setBase(-100);
			expect(attribute.base).toBe(0);
		});
	});

	describe("#lower", () => {
		it("should lower delta", () => {
			attribute.lower(5);
			expect(attribute.delta).toBe(-5);
		});
	});

	describe("#raise", () => {
		it("should raise delta", () => {
			attribute.lower(5);
			attribute.raise(2);
			expect(attribute.delta).toBe(-3);
		});

		it("should not allow raising delta above 0", () => {
			attribute.lower(10);
			expect(attribute.delta).toBe(-10);
			attribute.raise(100);
			expect(attribute.delta).toBe(0);
		});
	});
});
