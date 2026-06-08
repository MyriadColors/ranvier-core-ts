import { describe, it, expect, beforeEach, vi } from "vitest";
import { EffectableEntity } from "../../src/EffectableEntity";
import { Attribute, AttributeFormula } from "../../src/Attribute";
import { IGameState } from "../../src/GameState";

describe("EffectableEntity", () => {
	let entity: EffectableEntity;
	let mockState: IGameState;

	beforeEach(() => {
		entity = new EffectableEntity({});
		mockState = {
			AttributeFactory: {
				has: vi.fn().mockReturnValue(true),
				create: vi.fn().mockImplementation((name, base, delta) => new Attribute(name, base, delta)),
			},
		} as unknown as IGameState;
	});

	describe("Attribute Management", () => {
		it("should add and check attributes", () => {
			const attr = new Attribute("health", 100);
			entity.addAttribute(attr);
			expect(entity.hasAttribute("health")).toBe(true);
			expect(entity.getAttribute("health")).toBe(100);
		});

		it("should throw when getting non-existent attribute", () => {
			expect(() => entity.getAttribute("missing")).toThrow(RangeError);
		});

		it("should calculate getMaxAttribute without formula", () => {
			const attr = new Attribute("health", 100);
			entity.addAttribute(attr);
			expect(entity.getMaxAttribute("health")).toBe(100);
		});

		it("should calculate getMaxAttribute with formula", () => {
			const strength = new Attribute("strength", 10);
			const health = new Attribute("health", 100, 0, new AttributeFormula(["strength"], (ent, base, str) => {
				return base + (str * 5);
			}));

			entity.addAttribute(strength);
			entity.addAttribute(health);

			expect(entity.getMaxAttribute("health")).toBe(150);
			expect(entity.getAttribute("health")).toBe(150);
		});
	});

	describe("Property Evaluation", () => {
		it("should get property value", () => {
			(entity as any).testProp = 42;
			expect(entity.getProperty("testProp")).toBe(42);
		});

		it("should throw for non-existent property", () => {
			expect(() => entity.getProperty("missing")).toThrow(RangeError);
		});
	});

	describe("Attribute Updates", () => {
		beforeEach(() => {
			entity.addAttribute(new Attribute("health", 100));
		});

		it("should raise attribute", () => {
			const spy = vi.fn();
			entity.on("attributeUpdate", spy);

			entity.lowerAttribute("health", 50);
			expect(entity.getAttribute("health")).toBe(50);
			expect(spy).toHaveBeenCalledWith("health", 50);

			entity.raiseAttribute("health", 20);
			expect(entity.getAttribute("health")).toBe(70);
		});

		it("should set attribute to max", () => {
			entity.lowerAttribute("health", 50);
			entity.setAttributeToMax("health");
			expect(entity.getAttribute("health")).toBe(100);
		});

		it("should set attribute base", () => {
			entity.setAttributeBase("health", 200);
			expect(entity.getBaseAttribute("health")).toBe(200);
			expect(entity.getAttribute("health")).toBe(200);
		});
	});

	describe("Serialization & Hydration", () => {
		it("should serialize attributes", () => {
			entity.addAttribute(new Attribute("health", 100, -10));
			const serialized = entity.serialize();
			expect(serialized.attributes.health).toEqual({ base: 100, delta: -10 });
		});

		it("should hydrate attributes", () => {
			const data = {
				attributes: {
					health: { base: 100, delta: -20 }
				}
			};
			const hydrateEntity = new EffectableEntity(data);
			hydrateEntity.hydrate(mockState);

			expect(hydrateEntity.hasAttribute("health")).toBe(true);
			expect(hydrateEntity.getAttribute("health")).toBe(80);
			expect(mockState.AttributeFactory.create).toHaveBeenCalledWith("health", 100, -20);
		});
	});
});
