# Getting Started with Ranvier Core

Ranvier Core is a TypeScript engine for building Multi-User Dungeons (MUDs). It provides the foundational logic for entities, persistence, networking, and gameplay mechanics.

## Prerequisites

- Node.js (v16 or higher)
- npm or bun

## Quick Start: From Zero to Server

Follow these steps to initialize a new MUD project and get the server running.

### 1. Project Setup

Create a new directory for your game and initialize a Node.js project.

```bash
mkdir my-mud-game
cd my-mud-game
npm init -y
npm install typescript ts-node --save-dev
npx tsc --init
```

### 2. Install Ranvier Core and add dependencies

During development, you can link to your local clone of the core engine:

```bash
# In the ranvier-core-ts directory:
npm link

# In your my-mud-game directory:
npm link ranvier

# In you my-mud game
npm install commander --save-dev
```

### 3. Create Required Directories

Ranvier expects a `bundles` folder (for game content) and a `data` folder (for persistence). Even if they are empty, they must exist for the default configuration to work.

```bash
mkdir bundles
mkdir data
```

### 4. Create your Entry Point

Create a file named `index.ts` in your project root. This single file will act as your server's brain.

**Minimal Boilerplate (`index.ts`):**

```typescript
import {
  GameServer,
  Logger,
  type IGameState,
  PlayerManager,
  AreaManager,
  ItemManager,
  MobManager,
  CommandManager,
  BundleManager,
  EntityLoaderRegistry,
  DataSourceRegistry,
} from 'ranvier';
import path from 'node:path';
import process from 'node:process';
import { Command } from 'commander';

async function bootstrap() {
  /**
   * 1. Initialize the global GameState
   * The state object is the central registry for everything in your MUD.
   */
  const state: IGameState = {
    PlayerManager: new PlayerManager(),
    AreaManager: new AreaManager(),
    ItemManager: new ItemManager(),
    MobManager: new MobManager(),
    CommandManager: new CommandManager(),
    EntityLoaderRegistry: new EntityLoaderRegistry(),
    DataSourceRegistry: new DataSourceRegistry(),
    GameServer: new GameServer(),
    // ... Add other managers/factories as needed
  } as IGameState;

  /**
   * 2. Configure project paths
   */
  const bundlesPath = path.join(process.cwd(), 'bundles');
  state.BundleManager = new BundleManager(bundlesPath, state);

  Logger.log("Ranvier MUD is starting up...");

  try {
    /**
     * Startup performs the following: 
     * - Emits the 'startup' event on the GameServer
     * - Takes a commander.Command object for CLI integration
     */
    await state.GameServer.startup(new Command());
    
    // Example: Loading all bundles
    // await state.BundleManager.loadBundles();

    Logger.log("Game Server is online! Use a Telnet client to connect to localhost:4000");
  } catch (err) {
    Logger.error(`Critical failure during startup: ${(err as Error).message}`);
    process.exit(1);
  }
}

bootstrap();
```

This `index.ts` file serves as the entry point for your MUD, bringing together the core engine components and your game-specific data.
