import { Server as HTTPServer } from 'http';
import { Server as SocketServer } from 'socket.io';
import { registerSocketHandlers } from '@/server/handlers';

let io: SocketServer | null = null;

export function createSocketServer(httpServer: HTTPServer): SocketServer {
  if (io) return io;

  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
    pingTimeout: 60000,
    pingInterval: 25000,
  });

  io.on('connection', (socket) => {
    registerSocketHandlers(socket);
  });

  return io;
}

export function getSocketServer(): SocketServer | null {
  return io;
}
