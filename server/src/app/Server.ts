import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import http from 'http';
import { Server as SocketIOServer } from 'socket.io';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'body-parser';
import { handleConnection } from '../handlers/chatHandlers';
import authRoutes from '../routes/authRoutes';
import userRoutes from '../routes/userRoutes';
import chatRoomRoutes from '../routes/chatRoomRoutes';

const createExpressApp = (): Express => {
  const app = express();
  app.use(helmet());
  app.use(urlencoded({ extended: true }));

  app.use(
    cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'OPTIONS', 'PUT', 'PATCH', 'DELETE'],
    })
  );

  app.use(json());
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header('Cross-Origin-Opener-Policy', 'same-origin');
    res.header('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
  });

  app.use(cookieParser());
  app.use('/api', authRoutes);
  app.use('/api', userRoutes);
  app.use('/api', chatRoomRoutes);

  return app;
};

const createSocketIOServer = (server: http.Server): SocketIOServer => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: 'http://localhost:5173',
      methods: ['GET', 'POST', 'OPTIONS'],
      credentials: true,
    },
  });

  io.on('connection', socket => handleConnection(socket, io));

  return io;
};

const startServer = async (port: string): Promise<void> => {
  const app = createExpressApp();
  const server = http.createServer(app);
  const io = createSocketIOServer(server);

  await new Promise<void>(resolve => {
    server.listen(port, () => {
      console.log(`
------------------------------------------------------------------------------------------
✅ Backend App is running at http://localhost:${port} in ${app.get('env')} mode
------------------------------------------------------------------------------------------
✋ Press CTRL-C to stop
      `);
      resolve();
    });
  });
};

export { startServer };
