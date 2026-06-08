# The Entity Lifecycle

Every entity in Ranvier (Rooms, Items, NPCs) follows a strict creation and initialization lifecycle.

## 1. Definition Loading

Definitions are loaded from your data sources (e.g., `areas/limbo/items.yml`). These definitions are stored in the respective `Factory` (e.g., `ItemFactory`).

### Entity References (EntityRef)

Entities are referenced using a string format: `areaName:entityId`.

- **Example:** `limbo:sword`
- **areaName:** The name of the bundle/folder containing the area.
- **entityId:** The unique ID defined within that area's YAML file.

## 2. Instantiation

When you need a new item in the game, you call `factory.create(area, entityRef)`. This creates a "blank" instance with base properties but no external dependencies resolved.

## 3. Hydration

The `hydrate(state)` method is the most critical part of the lifecycle. During hydration, the entity:

- Attaches its behaviors and scripts.
- Resolves references to other entities (e.g., an NPC loading its starting equipment).
- Adds itself to its respective `Manager`.

> **Important:** Never use an entity for gameplay until `hydrate()` has been successfully called.

### Example: Creating and Hydrating an Item

```typescript
import { IGameState, Area, Item } from 'ranvier';

function spawnSword(state: IGameState, area: Area): Item {
  // 1. Instantiation
  // The 'limbo:sword' string is an entityRef (areaName:entityId)
  const newSword = state.ItemFactory.create(area, 'limbo:sword');

  // 2. Hydration
  // This resolves stats, scripts, and adds it to state.ItemManager
  newSword.hydrate(state);

  return newSword;
}
```

### Example: Finding an Item by UUID

```typescript
import { IGameState, Item } from 'ranvier';

function findItemByUuid(state: IGameState, uuid: string): Item | undefined {
  // The ItemManager tracks all active item instances in the game world using a Set.
  for (const item of state.ItemManager.items) {
    if (item.uuid === uuid) {
      console.log(`Found item: ${item.name} (UUID: ${item.uuid})`);
      return item;
    }
  }
}
```

### Example: Finding an NPC by UUID

```typescript
import { IGameState, Npc } from 'ranvier';

function findNpcByUuid(state: IGameState, uuid: string): Npc | undefined {
  // The MobManager tracks all active NPC instances using a Map keyed by UUID.
  return state.MobManager.mobs.get(uuid);
}
```
