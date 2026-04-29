'use client';

import { createContext } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  connect: () => void;
  disconnect: () => void;
  emit: (event: string, data?: unknown) => void;
  on: (event: string, callback: (data: unknown) => void) => void;
  off: (event: string) => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

let socketInstance: Socket | null = null;

export function useSocket() {
  return socketInstance;
}

export function connectSocket(url?: string) {
  if (!socketInstance) {
    socketInstance = io(url || process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });
  }
  return socketInstance;
}

export function disconnectSocket() {
  if (socketInstance) {
    socketInstance.disconnect();
    socketInstance = null;
  }
}