import { Server as SocketServer } from 'socket.io';

let io: SocketServer | null = null;

export function initSocketServer(httpServer: any): SocketServer {
  if (io) return io;

  io = new SocketServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
}

export function getSocketServer(): SocketServer | null {
  return io;
}