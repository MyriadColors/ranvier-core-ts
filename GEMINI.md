# Ranvier Core TypeScript (ranvier-core-ts)

This project is the TypeScript port of the core engine for the [Ranvier MUD](https://ranviermud.com) game engine. It provides the essential classes and managers for building a Multi-User Dungeon (MUD) game.

## Current Project State

The codebase has been fully migrated to TypeScript with strict type checking enabled. Recent updates include:
- **TypeScript Migration:** All core files have been converted to `.ts`.
- **Strict Typing:** `tsconfig.json` is configured with `strict: true` and `noImplicitAny: true`.
- **Method Signatures:** Fixed various method signature mismatches in `EntityFactory`, `TransportStream`, and `QuestReward`.
- **Modern ESM:** Configured for `ES2022` target and module output.
- **Dependency Updates:** Updated to use `winston` 3.x, `pretty-error`, and standard ESM imports.

## Project Overview

- **Core Technologies:** TypeScript, Node.js, Vitest (Testing), Winston (Logging).
- **Architecture:** Centralized state management via `IGameState`, which holds references to all major managers and factories.
- **Key Entities:**
    - `Player`, `Npc` (Characters)
    - `Room`, `Area` (World Structure)
    - `Item`, `Inventory` (Equipment and Items)
    - `Skill`, `Effect`, `Attribute` (Gameplay Mechanics)
    - `Quest` (Objectives)
    - `Command` (Player Input)
- **Extensibility:** Uses a `BehaviorManager` to attach event-driven logic to entities and `Scriptable` for custom behaviors.

## Building and Running

- **Build:** `npm run build` (runs `tsc`)
- **Watch mode:** `npm run watch`
- **Test:** `npm test` (runs `vitest`)
- **Linking:** This repo is intended to be linked to a Ranvier project using `npm link`.
    1. In this repo: `npm install && npm link`
    2. In your Ranvier project: `npm link ranvier`

## Development Conventions

- **TypeScript:** Strict type checking is enabled. Use interfaces for all entity definitions (e.g., `IPlayerDef`, `IRoomDef`).
- **Entity Management:** Always use the appropriate `Factory` (e.g., `ItemFactory`, `MobFactory`) to create entities and `Manager` (e.g., `ItemManager`, `PlayerManager`) to track them.
- **Event Handling:** Prefer using the `EventManager` and `BehaviorManager` for hook-based logic rather than hardcoding behaviors into base classes.
- **Persistence:** Data loading and saving are handled through `DataSourceRegistry` and `EntityLoaderRegistry`.
- **Logging:** Use the internal `Logger` (based on Winston) for all system logging.
- **State:** Access global game state through the `IGameState` interface.

## Linting & Code Rules

- **Unused Variables:** Unused arguments, parameters, variables, and/or functions are strictly FORBIDDEN. They must either be utilized or completely removed if safe to do so. NEVER prefix them with `_` to bypass linting errors.
- **Type Safety:** NEVER use `@ts-ignore` or `@ts-expect-error` to silence TypeScript errors. All type errors must be addressed structurally and logically.
- **Automated Modifications:** NEVER use automated scripts (e.g., shell scripts, `sed`, `node -e`) to perform large-scale modifications to the codebase. All changes must be made surgically and reviewed to ensure logical integrity and consistency with project standards.

## Key Directories

- `src/`: Main source code.
- `types/`: Custom type definitions (e.g., for WebSockets, Telnet, and external libraries like `sty`).
- `test/unit/`: Unit tests for core components (using Vitest).
- `dist/`: Compiled output (ESM).

## Architectural Patterns & Best Practices

### 1. Centralized State Access
Always access managers, factories, and registries through the `IGameState` interface. Avoid importing singleton instances directly into your modules to ensure better testability and decoupled logic.
```typescript
// Recommended
function someLogic(state: IGameState) {
    const player = state.PlayerManager.getPlayer('name');
}
```

### 2. Entity Identification
Use `entityReference` (the `area:id` string) as the primary way to identify and refer to entities (Rooms, NPCs, Items) across the codebase. Avoid using internal database IDs or object references for long-term storage or cross-bundle communication.

### 3. Event-Driven Communication
Prefer using `.emit()` and `.on()` for communication between different systems (e.g., a Quest reacting to a Mob death). This keeps systems decoupled and allows for easy extensibility via behaviors and scripts.
- **Naming:** Use `camelCase` for event names (e.g., `playerCurrencyUpdate`).
- **Documentation:** Use JSDoc `@event` tags to document events emitted by a class.

### 4. Strict Hydration Protocol
Entities must be created via their respective `Factory` and then explicitly hydrated via `.hydrate(state)`.
- **Initialization:** Perform basic setup in the `constructor`.
- **External Dependencies:** Resolve references to other entities (e.g., loading an item's inventory) inside the `hydrate` method.
- **Validation:** Always check `this.__hydrated` at the start of `hydrate` to prevent multiple initializations.

### 5. Async Registry Operations
Data loading and saving via `DataSourceRegistry` or `EntityLoaderRegistry` must always be treated as asynchronous. Use `async/await` and handle potential `Error` states gracefully using `Logger.error`.

### 6. Extension via Mixins
The core engine uses Mixins (`Scriptable`, `Metadatable`) to compose `GameEntity`. When extending base functionality:
- **Composition over Inheritance:** Prefer adding a behavior or a mixin over creating deep inheritance hierarchies.
- **Type Safety:** Ensure any new mixin correctly preserves the constructor signature using `Constructor<T>` from `src/Util.ts`.

### 7. Logging & Error Handling
- **System Logs:** Use `Logger.verbose` for trace-level info and `Logger.warn` for recoverable issues (e.g., a missing optional script).
- **Critical Errors:** Use `Logger.error` and consider if the state is still valid. For non-recoverable data corruption during boot, prefer `process.exit(1)` after logging the error.

## Eradicating `any` & Strengthening Type Safety

The use of `any` is considered a technical debt. All new code must be fully typed, and legacy `any` types should be migrated using the following strategies:

### 1. Prefer `unknown` over `any`
When dealing with values from external sources (JSON files, network packets), use `unknown`. This forces the consumer to perform type checking or casting before use.
```typescript
// Safer approach
const data: unknown = JSON.parse(jsonString);
if (typeof data === 'object' && data !== null && 'name' in data) {
    // TypeScript now knows 'data' has a 'name' property
}
```

### 2. Leverage Generics for Reusable Logic
Avoid `any` in utility functions or base classes by using Generics. This preserves type information through the call stack.
```typescript
// Recommended: preserves the type of the loader return value
_getLoader<T>(loader: ((...args: any[]) => T) | T, ...args: any[]): T {
    return typeof loader === 'function' ? loader(...args) : loader;
}
```

### 3. Discriminated Unions for Entity Definitions
Use Discriminated Unions to handle entities that can have multiple shapes (e.g., Quest Goals). This allows for exhaustive switch-case checking.
```typescript
type GoalDef = KillGoalDef | FetchGoalDef | InteractionGoalDef;

function handleGoal(def: GoalDef) {
    switch (def.type) {
        case 'KILL': // def is narrowed to KillGoalDef
            break;
    }
}
```

### 4. Type Guards & Predicates
Create custom type guards to safely narrow broad types (like `AnyCharacter`) into specific instances (`Player` or `Npc`) without using unsafe casts (`as any`).
```typescript
function isPlayer(entity: AnyCharacter): entity is Player {
    return entity instanceof Player;
}
```

### 5. Strategy for Migration
When encountering `any` in legacy method signatures:
1. **Identify the Shape:** Look at how the variable is used and define an `interface` or `type` alias.
2. **Incremental Narrowing:** If the full shape is complex, start with `Record<string, unknown>` and narrow it as you map out the properties.
3. **Update Callers:** Use the TypeScript compiler to find all call sites and ensure they provide compatible types.
4. **Finality:** Only use `any` as a temporary escape hatch during large-scale refactors, never as a permanent solution. All `any` usage MUST be accompanied by a `// TODO: [Ref] Define specific type` comment.

## Project Metadata (Private Memory)
- Private project memory index is located at: `C:\Users\Pedro\.gemini\tmp\ranvier-core-ts\memory\MEMORY.md`
