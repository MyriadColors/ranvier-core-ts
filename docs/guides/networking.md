# Networking & Streams

Ranvier is client-agnostic. It communicates with players via the `TransportStream`.

## The TransportStream

A `TransportStream` acts as a bridge between the core engine and a specific network protocol (Telnet, WebSockets, etc.).

- **Input:** The stream emits `data` events when the player sends input. The engine's input event handlers parse this data.
- **Output:** The core calls `stream.write(message)` to send data back to the client.

### Essential Events

When implementing or using a stream, you should be aware of these standard Node.js-style events:

- `data`: Emitted when raw input is received.
- `close`: Emitted when the connection is terminated.
- `error`: Emitted on network errors.
- `drain`: Emitted when the write buffer is empty, allowing for more data to be sent.

## The Input Pipeline

Once a stream is attached to a player, input usually flows through an **Input Event Handler**. These handlers are defined in your bundles and manage states like "login", "character creation", or "gameplay".

## Implementing a Custom Stream

You can implement your own `TransportStream` to support new protocols. Simply extend the base `TransportStream` and implement the `write()` method.

### Example: A basic WebSocket stream

```typescript
import { TransportStream } from 'ranvier';
import type { WebSocket } from 'ws';

export class WebSocketStream extends TransportStream {
  private socket: WebSocket;

  constructor(socket: WebSocket) {
    super();
    this.socket = socket;

    // 1. Emit 'data' when the player sends input
    this.socket.on('message', (data: Buffer) => {
      this.emit('data', data.toString('utf8'));
    });

    this.socket.on('close', () => {
      this.emit('close');
    });
  }

  // 2. Implement write() to send data to the player
  write(message: string): boolean {
    if (this.socket.readyState === this.socket.OPEN) {
      this.socket.send(message);
      return true;
    }
    return false;
  }
}
```
