import { Server as SocketServer, Socket } from 'socket.io';
import { processAgentMessage } from '@/agents/main-agent';

export function registerAgentHandler(io: SocketServer): void {
  io.on('connection', (socket: Socket) => {
    socket.on('agent_message', async (data: {
      message: string;
      pageContext: string;
      fileData?: { id: string; name: string; type: string }[];
      sessionId: string;
      userId?: string;
    }) => {
      socket.emit('agent_reasoning_start', {});

      const result = await processAgentMessage(data);

      setTimeout(() => {
        if (result.reasoning) {
          const lines = result.reasoning.split('\n');
          lines.forEach((line, i) => {
            setTimeout(() => {
              socket.emit('agent_reasoning_chunk', { chunk: line + '\n' });
            }, i * 100);
          });
        }

        setTimeout(() => {
          socket.emit('agent_reasoning_end', {});
          socket.emit('agent_response', result);
        }, (result.reasoning?.split('\n').length || 1) * 100 + 200);
      }, 300);
    });

    socket.on('agent_clarification_select', async (data: {
      optionId: string;
      originalMessage: string;
      sessionId: string;
      userId?: string;
      pageContext: string;
    }) => {
      const result = await processAgentMessage({
        message: `Use tool: ${data.optionId}. Original request: "${data.originalMessage}"`,
        pageContext: data.pageContext,
        sessionId: data.sessionId,
        userId: data.userId,
      });

      socket.emit('agent_response', result);
    });
  });
}
