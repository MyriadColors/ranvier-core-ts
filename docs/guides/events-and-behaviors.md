# Events & Behaviors

Ranvier Core uses an event-driven architecture to keep systems decoupled and extensible.

## EventManager

The `EventManager` is used to attach listeners to global or entity-specific events. For example, you might listen to `playerCurrencyUpdate` to update a player's UI.

## BehaviorManager

Behaviors are collections of event listeners that can be attached to any `GameEntity`. This is how you implement logic like "aggressive" NPCs or "cursed" items without hardcoding it into the base classes.

> **Note on Scoping:** Listeners are typically written as a function returning a function. This allows the core to bind `this` to the entity instance correctly at runtime.

### Example: A simple aggressive behavior

```typescript
import { IGameState, Character } from 'ranvier';

export default {
  listeners: {
    updateTick: (state: IGameState) => function (this: Character) {
      if (this.isInCombat()) {
        return;
      }
      // logic to find a target and attack...
    }
  }
};
```
