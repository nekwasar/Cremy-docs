import { Socket } from 'socket.io';
import { SOCKET_EVENTS, SocketEventType } from './events';

interface StreamHandler {
  emit(event: string, data: any): void;
  userId: string;
}

export function registerSocketHandlers(socket: Socket): void {
  const eventTypes: SocketEventType[] = ['generate', 'edit', 'format', 'translate', 'summarize', 'cancel'];

  for (const eventType of eventTypes) {
    socket.on(eventType, async (payload: any) => {
      const definition = SOCKET_EVENTS[eventType];

      try {
        const handler = await getHandler(definition.handler);
        const result = await handler(socket as unknown as StreamHandler, payload);
        socket.emit('complete', { document: result });
      } catch (error: any) {
        socket.emit('error', {
          code: error.code || 'INTERNAL_ERROR',
          message: error.message || 'Operation failed',
        });
      }
    });
  }
}

async function getHandler(name: string): Promise<(socket: Socket, payload: any) => Promise<any>> {
  switch (name) {
    case 'generate-handler':
      return (await import('./generate-handler')).handleGenerate;
    case 'edit-handler':
      return (await import('./edit-handler')).handleEdit;
    case 'format-handler':
      return (await import('./format-handler')).handleFormat;
    case 'translate-handler':
      return (await import('./translate-handler')).handleTranslate;
    case 'summarize-handler':
      return (await import('./summarize-handler')).handleSummarize;
    default:
      throw new Error(`Unknown handler: ${name}`);
  }
}
