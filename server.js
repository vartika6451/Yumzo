import { createServer } from 'http';
import next from 'next';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = parseInt(process.env.PORT || '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = createServer(async (req, res) => {
    try {
      const parsedUrl = new URL(req.url, `http://${hostname}:${port}`);
      await handle(req, res, {
        pathname: parsedUrl.pathname,
        query: Object.fromEntries(parsedUrl.searchParams),
      });
    } catch (err) {
      console.error('Error handling request:', req.url, err);
      res.statusCode = 500;
      res.end('Internal Server Error');
    }
  });

  const io = new Server(server, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST', 'PATCH'],
      credentials: true,
    },
  });

  // Attach io to global so Next.js Route Handlers can emit live socket events
  global.io = io;

  io.on('connection', (socket) => {
    console.log(`[Socket.io] Client connected: ${socket.id}`);

    socket.on('disconnect', () => {
      console.log(`[Socket.io] Client disconnected: ${socket.id}`);
    });
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`\n==================================================`);
    console.log(`🚀 Yumzo Next.js + Socket.io Server Ready!`);
    console.log(`🌐 Local URL: http://${hostname}:${port}`);
    console.log(`⚡ Mode: ${dev ? 'development' : 'production'}`);
    console.log(`==================================================\n`);
  });
});
