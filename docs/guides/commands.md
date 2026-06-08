# Commands

Commands are the primary way players interact with the game world. They are organized into bundles and handled by the `CommandManager`.

## Command Structure

A command consists of:

- **Name:** The string the player types.
- **Aliases:** Alternative names for the command (e.g., `i` for `inventory`).
- **Handler:** A function that executes the command logic.

## Defining a Command

The command definition is typically a module export within a bundle's `commands/` directory. It uses a "thunk" pattern (a function returning a function) to allow the `IGameState` to be injected by the engine during the loading process.

```typescript
import { IGameState, Player } from 'ranvier';

export default {
  aliases: ['l', 'look'],
  command: (state: IGameState) => (args: string, player: Player, commandName: string) => {
    if (!args) {
      // Default look at the room
      player.emit('lookRoom');
      return;
    }

    // Look at a specific target
    player.emit('lookTarget', args);
  }
};
```

### Parameters

The injection process works in two stages:

1. **Outer Function (Injection):** Receives the global `state` (`IGameState`).
2. **Inner Function (Execution):** Receives the runtime parameters:
    - **args:** Everything typed after the command name.
    - **player:** The `Player` instance executing the command.
    - **commandName:** The actual string used to trigger the command (useful if you have multiple aliases).

## Command Aliases & Precedence

Ranvier matches commands based on prefix. If a player types `inv`, the engine will match it to `inventory` unless another command starts with `inv`. You can use `aliases` to provide explicit shortcuts.
