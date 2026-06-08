# Commands

Commands are the primary way players interact with the game world. They are organized into bundles and handled by the `CommandManager`.

## Command Structure

A command consists of:

- **Name:** The string the player types.
- **Aliases:** Alternative names for the command (e.g., `i` for `inventory`).
- **Handler:** A function that executes the command logic.

## Defining a Command

Commands are typically defined as a module export within a bundle's `commands/` directory.

```typescript
import { IGameState, Player } from 'ranvier';

export default {
  aliases: ['l', 'look'],
  command: (state: IGameState) => (args: string, player: Player, commandName: string) => {
    if (!args) {
      // Default look at the room
      return player.emit('lookRoom');
    }

    // Look at a specific target
    player.emit('lookTarget', args);
  }
};
```

### Parameters

The command handler is a "thunk" (a function returning a function) to allow the `IGameState` to be injected during the loading process:

1. **state:** The global `IGameState`.
2. **args:** Everything typed after the command name.
3. **player:** The `Player` instance executing the command.
4. **commandName:** The actual string used to trigger the command (useful if you have multiple aliases).

## Command Aliases & Precedence

Ranvier matches commands based on prefix. If a player types `inv`, the engine will match it to `inventory` unless another command starts with `inv`. You can use `aliases` to provide explicit shortcuts.
