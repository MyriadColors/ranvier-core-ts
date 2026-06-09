import { describe, it, expect, vi, beforeEach } from "vitest";
import { Ranvier } from "../../src/Ranvier";
import { Broadcast, BroadcastBuilder } from "../../src/Broadcast";
import { Character } from "../../src/Character";
import { IGameState } from "../../src/GameState";
import { Damage } from "../../src/Damage";
import { Heal } from "../../src/Heal";
import { Room } from "../../src/Room";
import { Area } from "../../src/Area";

// Mock Damage and Heal since we don't want to test their full implementation here
vi.mock("../../src/Damage", () => {
  const DamageMock = vi.fn().mockImplementation(function() {
    return {
      commit: vi.fn(),
    };
  });
  return { Damage: DamageMock };
});

vi.mock("../../src/Heal", () => {
  const HealMock = vi.fn().mockImplementation(function() {
    return {
      commit: vi.fn(),
    };
  });
  return { Heal: HealMock };
});

describe("Convenience API", () => {
  describe("Ranvier Facade", () => {
    let state: IGameState;
    let ranvier: Ranvier;

    beforeEach(() => {
      state = {
        PlayerManager: { getPlayer: vi.fn() },
        RoomManager: { getRoom: vi.fn() },
        AreaManager: { getArea: vi.fn() },
        MobManager: { getMob: vi.fn() },
        ItemManager: { getItem: vi.fn() },
      } as unknown as IGameState;
      ranvier = new Ranvier(state);
    });

    it("should get a player", () => {
      ranvier.getPlayer("test");
      expect(state.PlayerManager.getPlayer).toHaveBeenCalledWith("test");
    });

    it("should get a room", () => {
      ranvier.getRoom("area:id");
      expect(state.RoomManager.getRoom).toHaveBeenCalledWith("area:id");
    });

    it("should get an area", () => {
      ranvier.getArea("test");
      expect(state.AreaManager.getArea).toHaveBeenCalledWith("test");
    });

    it("should get an npc", () => {
      ranvier.getNpc("area:id");
      expect(state.MobManager.getMob).toHaveBeenCalledWith("area:id");
    });

    it("should get an item", () => {
      ranvier.getItem("area:id");
      expect(state.ItemManager.getItem).toHaveBeenCalledWith("area:id");
    });

    it("should find an entity", () => {
      const room = { id: "room" };
      (state.RoomManager.getRoom as any).mockReturnValue(room);
      expect(ranvier.findEntity("test")).toBe(room);

      (state.RoomManager.getRoom as any).mockReturnValue(undefined);
      const npc = { id: "npc" };
      (state.MobManager.getMob as any).mockReturnValue(npc);
      expect(ranvier.findEntity("test")).toBe(npc);
    });
  });

  describe("Broadcast Fluent API", () => {
    it("should create a BroadcastBuilder", () => {
      const target = { getBroadcastTargets: () => [] };
      const builder = Broadcast.to(target);
      expect(builder).toBeInstanceOf(BroadcastBuilder);
    });

    it("should call Broadcast.sayAt when calling say()", () => {
      const spy = vi.spyOn(Broadcast, "sayAt").mockImplementation(() => {});
      const target = { getBroadcastTargets: () => [] };
      Broadcast.to(target).say("hello");
      expect(spy).toHaveBeenCalledWith(target, "hello", undefined, undefined);
      spy.mockRestore();
    });

    it("should call Broadcast.sayAtExcept when using except()", () => {
      const spy = vi.spyOn(Broadcast, "sayAtExcept").mockImplementation(() => {});
      const target = { getBroadcastTargets: () => [] };
      const exclude = { getBroadcastTargets: () => [] };
      Broadcast.to(target).except(exclude).say("hello");
      expect(spy).toHaveBeenCalledWith(target, "hello", [exclude], undefined, undefined);
      spy.mockRestore();
    });

    it("should support wrapping and formatting", () => {
      const spy = vi.spyOn(Broadcast, "sayAt").mockImplementation(() => {});
      const target = { getBroadcastTargets: () => [] };
      const formatter = (t: any, m: string) => m;
      Broadcast.to(target).wrap(80).format(formatter).say("hello");
      expect(spy).toHaveBeenCalledWith(target, "hello", 80, formatter);
      spy.mockRestore();
    });
  });

  describe("Character Shorthand", () => {
    it("should have say()", () => {
      const spy = vi.spyOn(Broadcast, "sayAt").mockImplementation(() => {});
      const character = {
        getBroadcastTargets: () => [],
        say: Character.prototype.say,
      };
      (character as any).say("hello");
      expect(spy).toHaveBeenCalledWith(character, "hello", undefined);
      spy.mockRestore();
    });

    it("should have damage()", () => {
      const character = {
        damage: Character.prototype.damage,
      };
      (character as any).damage(10);
      expect(Damage).toHaveBeenCalled();
      const damageInstance = (Damage as any).mock.results[0].value;
      expect(damageInstance.commit).toHaveBeenCalledWith(character);
    });

    it("should have heal()", () => {
      const character = {
        heal: Character.prototype.heal,
      };
      (character as any).heal(10);
      expect(Heal).toHaveBeenCalled();
      const healInstance = (Heal as any).mock.results[0].value;
      expect(healInstance.commit).toHaveBeenCalledWith(character);
    });
  });

  describe("Room Shorthand", () => {
    it("should have broadcast()", () => {
      const spy = vi.spyOn(Broadcast, "sayAtExcept").mockImplementation(() => {});
      const room = {
        getBroadcastTargets: () => [],
        broadcast: Room.prototype.broadcast,
      };
      (room as any).broadcast("hello");
      expect(spy).toHaveBeenCalledWith(room, "hello", [], undefined);
      spy.mockRestore();
    });
  });

  describe("Area Shorthand", () => {
    it("should have broadcast()", () => {
      const spy = vi.spyOn(Broadcast, "sayAtExcept").mockImplementation(() => {});
      const area = {
        getBroadcastTargets: () => [],
        broadcast: Area.prototype.broadcast,
      };
      (area as any).broadcast("hello");
      expect(spy).toHaveBeenCalledWith(area, "hello", [], undefined);
      spy.mockRestore();
    });
  });
});
