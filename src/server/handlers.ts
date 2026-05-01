import { Socket } from 'socket.io';
import { SOCKET_EVENTS, SocketEventType } from './events';

export function registerSocketHandlers(socket: Socket): void {
  const eventTypes: SocketEventType[] = ['generate', 'edit', 'format', 'translate', 'summarize', 'cancel'];

  for (const eventType of eventTypes) {
    socket.on(eventType, async (payload: any) => {
      const definition = SOCKET_EVENTS[eventType];

      try {
        const handler = await getHandler(definition.handler);
        const result = await (handler as any)(socket, payload);
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

async function getHandler(name: string): Promise<(handler: any, payload: any) => Promise<any>> {
  switch (name) {
    case 'generate-handler':
      return (await import('./generate-handler')).handleGenerate as any;
    case 'edit-handler':
      return (await import('./edit-handler')).handleEdit as any;
    case 'format-handler':
      return (await import('./format-handler')).handleFormat as any;
    case 'translate-handler':
      return (await import('./translate-handler')).handleTranslate as any;
    case 'summarize-handler':
      return (await import('./summarize-handler')).handleSummarize as any;
    default:
      throw new Error(`Unknown handler: ${name}`);
  }
}
