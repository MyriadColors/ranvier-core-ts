# Getting Started with Ranvier Core

Ranvier Core is a TypeScript engine for building Multi-User Dungeons (MUDs). It provides the foundational logic for entities, persistence, networking, and gameplay mechanics.

## Prerequisites

- Node.js (v16 or higher)
- npm or bun

## Installation

To use the core engine in your project, it is recommended to link it locally during development.

1. **Clone the Core:**

    ```bash
    git clone https://github.com/RanvierMUD/ranvier-core-ts.git
    cd ranvier-core-ts
    npm install
    npm link
    ```

2. **Link to your MUD project:**

    ```bash
    cd /path/to/your-mud-project
    npm link ranvier
    ```

## Project Structure

Ranvier projects are organized into **Bundles**. A typical project structure looks like this:

```text
my-mud/
├── bundles/                # Game content (areas, items, npcs, logic)
│   ├── ranvier-areas/
│   └── ranvier-input-events/
├── data/                   # Persisted player data and accounts
├── src/
│   └── index.ts            # Entry point
├── package.json
└── tsconfig.json
```

### Bootstrapping the Server

Your entry point assembles the core managers and factories into the `IGameState`. This state is the central registry passed to the `GameServer`.

```typescript
import {
  GameServer,
  PlayerManager,
  ItemManager,
  AreaFactory,
  Config,
  Logger,
  DataSourceRegistry,
  EntityLoaderRegistry,
  YamlDataSource,
  IGameState,
} from 'ranvier';

// Basic configuration for the game server
const config: Config = {
  port: 4000,
  // Add other configurations like `entityDirectory`, `scriptDirectory`, etc.
  // For now, we'll assume default paths or that data is loaded via data sources.
};

// Initialize data sources (e.g., for loading game data from YAML files)
const dataSourceRegistry = new DataSourceRegistry();
dataSourceRegistry.add('yaml', new YamlDataSource({ dir: __dirname + '/data' }));

// Initialize entity loaders and bind them to data sources
const entityLoaderRegistry = new EntityLoaderRegistry();
entityLoaderRegistry.set('areas', dataSourceRegistry.get('yaml'));
entityLoaderRegistry.set('items', dataSourceRegistry.get('yaml'));

const state = {
  PlayerManager: new PlayerManager(),
  ItemManager: new ItemManager(),
  AreaFactory: new AreaFactory(entityLoaderRegistry.get('areas')),
  // Add other managers and factories as needed for your game
} as IGameState; // Cast to IGameState to ensure all required properties are present

// Create and start the game server
const server = new GameServer(config, state);

async function bootstrap() {
  try {
    await server.start();
    Logger.log(`Ranvier MUD server started on port ${config.port}`);
  } catch (error) {
    Logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

bootstrap();

// Example of how you might load an area (this would typically happen during game initialization)
// state.AreaFactory.loadArea('limbo');

// You would also define your game entities (areas, items, NPCs) in YAML files
// within a 'data' directory (or whatever you configure your YamlDataSource to use).
// Example: data/areas/limbo/info.yml, data/areas/limbo/rooms.yml, data/areas/limbo/items.yml
```

This `index.ts` file serves as the entry point for your MUD, bringing together the core engine components and your game-specific data.
