import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
      autoConnect: false,
      reconnection: true,
      reconnectionAttempts: 3,
      reconnectionDelay: 1000,
    });
  }
  return socket;
}

export function connectSocket() {
  const s = getSocket();
  if (!s.connected) {
    s.connect();
  }
  return s;
}

export function disconnectSocket() {
  if (socket?.connected) {
    socket.disconnect();
  }
}

export function emitEvent(event: string, data: unknown) {
  const s = getSocket();
  if (s.connected) {
    s.emit(event, data);
  }
}

export function onEvent(event: string, callback: (data: unknown) => void) {
  const s = getSocket();
  s.on(event, callback);
}

export function offEvent(event: string, callback: (data: unknown) => void) {
  const s = getSocket();
  s.off(event, callback);
}