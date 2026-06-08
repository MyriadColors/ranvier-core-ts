import { describe, it, expect, beforeEach } from "vitest";
import { Attribute } from "../../src/Attribute";

describe("Basic Attribute", () => {
	let attribute: Attribute;
	const base = 10;
	beforeEach(() => {
		attribute = new Attribute("test", base);
	});

	describe("Constructor", () => {
		it("should throw if base is NaN", () => {
			expect(() => new Attribute("test", NaN)).toThrow(TypeError);
		});

		it("should throw if delta is NaN", () => {
			expect(() => new Attribute("test", 10, NaN)).toThrow(TypeError);
		});
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

	describe("#setDelta", () => {
		it("should set delta directly", () => {
			attribute.setDelta(-5);
			expect(attribute.delta).toBe(-5);
		});

		it("should clamp delta to 0", () => {
			attribute.setDelta(5);
			expect(attribute.delta).toBe(0);
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

	describe("#serialize", () => {
		it("should return base and delta", () => {
			attribute.lower(5);
			const serialized = attribute.serialize();
			expect(serialized).toEqual({ base: 10, delta: -5 });
		});
	});
});

import { AttributeFormula } from "../../src/Attribute";
import { EffectableEntity } from "../../src/EffectableEntity";

describe("AttributeFormula", () => {
	it("should throw if requires is not an array", () => {
		// @ts-expect-error
		expect(() => new AttributeFormula(null, () => 1)).toThrow(TypeError);
	});

	it("should throw if fn is not a function", () => {
		// @ts-expect-error
		expect(() => new AttributeFormula([], null)).toThrow(TypeError);
	});

	it("should evaluate correctly", () => {
		const formula = new AttributeFormula([], (entity, ...args) => {
			return args[0] * 2;
		});

		const attribute = new Attribute("test", 10);
		const entity = new EffectableEntity({});
		expect(formula.evaluate(attribute, entity, 5)).toBe(10);
	});
});

