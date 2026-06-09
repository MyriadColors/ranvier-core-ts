import { describe, it, expect, beforeEach, vi } from "vitest";
import { Player, IPlayerDef } from "../../src/Player";
import { Attribute } from "../../src/Attribute";
import { PlayerRoles } from "../../src/PlayerRoles";
import { Account } from "../../src/Account";
import { Config } from "../../src/Config";

describe("Player", () => {
	let player: Player;
	const mockAccount = { username: "testuser" } as Account;

	beforeEach(() => {
		Config.load({});
		const data: IPlayerDef = {
			name: "TestPlayer",
			account: mockAccount,
			password: "password",
			experience: 100,
			prompt: "> ",
			role: PlayerRoles.PLAYER,
			quests: { completed: [], active: [] }
		} as IPlayerDef;

		player = new Player(data);
		// Manually mark as hydrated for emit to work
		player.__hydrated = true;
	});

	describe("Constructor", () => {
		it("should initialize with correct values", () => {
			expect(player.name).toBe("TestPlayer");
			expect(player.experience).toBe(100);
			expect(player.role).toBe(PlayerRoles.PLAYER);
			expect(player.prompt).toBe("> ");
		});

		it("should initialize managers", () => {
			expect(player.questTracker).toBeDefined();
			expect(player.commandQueue).toBeDefined();
		});
	});

	describe("Prompt Interpolation", () => {
		beforeEach(() => {
			player.addAttribute(new Attribute("health", 100, -20));
			player.addAttribute(new Attribute("mana", 50));
		});

		it("should interpolate attribute tokens", () => {
			const prompt = "H: %health.current%/%health.max% M: %mana.current%";
			const interpolated = player.interpolatePrompt(prompt);
			expect(interpolated).toBe("H: 80/100 M: 50");
		});

		it("should handle extra data", () => {
			const prompt = "Level: %stats.level%";
			const interpolated = player.interpolatePrompt(prompt, { stats: { level: 5 } });
			expect(interpolated).toBe("Level: 5");
		});

		it("should handle invalid tokens", () => {
			const prompt = "Invalid: %missing%";
			const interpolated = player.interpolatePrompt(prompt);
			expect(interpolated).toBe("Invalid: invalid-token");
		});
	});

	describe("Extra Prompts", () => {
		it("should manage extra prompts", () => {
			const renderer = vi.fn().mockReturnValue("extra");
			player.addPrompt("test", renderer);
			expect(player.hasPrompt("test")).toBe(true);
			
			player.removePrompt("test");
			expect(player.hasPrompt("test")).toBe(false);
		});
	});

	describe("Serialization", () => {
		it("should serialize player data", () => {
			player.addAttribute(new Attribute("health", 100));
			const serialized = player.serialize();
			expect(serialized.account).toBe("testuser");
			expect(serialized.experience).toBe(100);
			expect(serialized.prompt).toBe("> ");
			expect(serialized.role).toBe(PlayerRoles.PLAYER);
		});
	});
});
