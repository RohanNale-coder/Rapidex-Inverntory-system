import { Server as SocketIOServer } from 'socket.io';
import { Server as HttpServer } from 'http';

export const initializeSocket = (server: HttpServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
      credentials: true,
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  return io;
};
