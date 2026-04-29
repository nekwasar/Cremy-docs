import { Server as SocketServer } from 'socket.io';
import { Socket } from 'socket.io';

interface Connection {
  id: string;
  userId: string;
  socket: Socket;
  connectedAt: Date;
}

const connections = new Map<string, Connection>();
const userConnections = new Map<string, Set<string>>();

const RECONNECT_RETRIES = 3;
const CONNECT_TIMEOUT_MS = 30000;
const HEARTBEAT_INTERVAL_MS = 30000;

let heartbeatInterval: NodeJS.Timeout | null = null;

export function initConnectionManager(io: SocketServer): void {
  io.on('connection', (socket: Socket) => {
    const connectionId = socket.id;
    
    connections.set(connectionId, {
      id: connectionId,
      userId: (socket.data as any).userId || '',
      socket,
      connectedAt: new Date(),
    });

    socket.on('disconnect', () => {
      cleanupConnection(connectionId);
    });

    socket.on('error', (error) => {
      console.error('Socket error:', error);
      cleanupConnection(connectionId);
    });

    setTimeout(() => {
      const conn = connections.get(connectionId);
      if (conn && !conn.socket.connected) {
        handleReconnect(connectionId, io);
      }
    }, CONNECT_TIMEOUT_MS);
  });

  startHeartbeat(io);
}

function handleReconnect(connectionId: string, io: SocketServer): void {
  const conn = connections.get(connectionId);
  if (!conn) return;

  let retryCount = (conn.socket.data as any).retryCount || 0;

  if (retryCount < RECONNECT_RETRIES) {
    const delay = Math.pow(2, retryCount) * 1000;
    setTimeout(() => {
      if (!connections.has(connectionId)) {
        const newSocket = io.sockets.sockets.get(connectionId);
        if (newSocket) {
          (newSocket.data as any).retryCount = retryCount + 1;
        }
      }
    }, delay);
  }
}

function cleanupConnection(connectionId: string): void {
  const conn = connections.get(connectionId);
  if (!conn) return;

  if (conn.userId) {
    const userConns = userConnections.get(conn.userId);
    if (userConns) {
      userConns.delete(connectionId);
      if (userConns.size === 0) {
        userConnections.delete(conn.userId);
      }
    }
  }

  connections.delete(connectionId);
}

export function registerUserConnection(userId: string, socket: Socket): void {
  const socketId = socket.id;
  
  const conn = connections.get(socketId);
  if (conn) {
    conn.userId = userId;
  }

  if (!userConnections.has(userId)) {
    userConnections.set(userId, new Set());
  }
  userConnections.get(userId)!.add(socketId);
}

export function getUserConnectionCount(userId: string): number {
  return userConnections.get(userId)?.size || 0;
}

export function disconnectUser(userId: string): void {
  const userConns = userConnections.get(userId);
  if (!userConns) return;

  for (const socketId of userConns) {
    const conn = connections.get(socketId);
    if (conn) {
      conn.socket.disconnect();
    }
  }

  userConnections.delete(userId);
}

function startHeartbeat(io: SocketServer): void {
  if (heartbeatInterval) return;

  heartbeatInterval = setInterval(() => {
    io.sockets.sockets.forEach((socket) => {
      if (socket.connected) {
        socket.emit('ping');
      }
    });
  }, HEARTBEAT_INTERVAL_MS);
}

export function stopHeartbeat(): void {
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval);
    heartbeatInterval = null;
  }
}