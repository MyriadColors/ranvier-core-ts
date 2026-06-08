# Architecture Overview

The Ranvier Core follows a centralized management pattern built around the `IGameState`.

## IGameState: The Registry

The `IGameState` interface is the single source of truth for your game's state. It holds references to all major factories and managers.

```typescript
export interface IGameState {
    PlayerManager: PlayerManager;
    ItemManager: ItemManager;
    AreaFactory: AreaFactory;
    // ...
}
```

## Factories vs. Managers

- **Factories:** Responsible for creating new instances of entities (Items, NPCs, Rooms) from definitions.
- **Managers:** Responsible for tracking active instances in the game world.

## Bundles: Modular Content

Bundles are the primary way to organize code and data. A bundle can contain:

- **Areas:** YAML/JSON definitions for the physical world.
- **Scripts:** Custom logic for entities.
- **Behaviors:** Reusable event listeners.
- **Commands:** Player input handlers.

## The Game Loop

The `GameServer` orchestrates the main execution loop. It triggers periodic updates:

- **updateTick:** A high-frequency tick used for combat and responsive logic.
- **pulse:** Used for slow-changing game world effects like weather or regeneration.
- **save:** Triggered to persist the state of entities and players to the data source.

## Data Persistence

The core uses a `DataSourceRegistry` and `EntityLoaderRegistry` to abstract away where data comes from (YAML, JSON, SQL, etc.). This allows you to swap out storage backends without changing your gameplay logic.

### Example: YAML Data Source

To use YAML files for your game data (like areas and items), you configure the registry to use a YAML loader. Here is a conceptual example of setting up a data source:

```typescript
import { DataSourceRegistry, EntityLoaderRegistry } from 'ranvier';
import { YamlDataSource } from 'ranvier-datasource-yaml'; // Example package

// Initialize the data source registry
const dataRegistry = new DataSourceRegistry();
dataRegistry.add('yaml', new YamlDataSource({ dir: __dirname + '/data' }));

// Bind the data source to a specific entity loader
const entityLoaders = new EntityLoaderRegistry();
entityLoaders.set('areas', dataRegistry.get('yaml'));
```
