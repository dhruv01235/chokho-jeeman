import { createServer } from 'http';
import { Server } from 'socket.io';

const PORT = parseInt(process.env.SOCKET_PORT || '3001', 10);
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:3000';

const httpServer = createServer();
const io = new Server(httpServer, {
  cors: {
    origin: CLIENT_URL,
    methods: ['GET', 'POST'],
  },
});

io.on('connection', (socket) => {
  socket.on('join-queue', () => {
    io.emit('queue-updated', { message: 'Queue updated' });
  });
  socket.on('disconnect', () => {});
});

httpServer.listen(PORT, () => {
  process.stdout.write(`Socket.IO server running on port ${PORT}\n`);
});
