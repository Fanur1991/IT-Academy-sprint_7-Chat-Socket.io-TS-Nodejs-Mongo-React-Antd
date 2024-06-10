import { json, urlencoded } from 'body-parser';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import http from 'http';
import { Server as HttpServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { handleConnection } from '../handlers/chatHandlers';
import authRoutes from '../routes/authRoutes';
// import chatRoomRoutes from '../routes/chatRoomRoutes';

export class Server {
  private readonly express: express.Express;
  private readonly port: string;
  private server: HttpServer;
  private io: SocketIOServer;

  constructor(port: string) {
    this.port = port;
    this.express = express();
    this.express.use(helmet());
    this.express.use(cors());
    this.express.use(json());
    this.express.use(urlencoded({ extended: true }));
    this.express.use((_req, res, next) => {
      res.header('Cross-Origin-Opener-Policy', 'same-origin');
      res.header('Cross-Origin-Embedder-Policy', 'require-corp');
      next();
    });

    this.express.use('/', authRoutes);
    // this.express.use('/api/', chatRoomRoutes);

    this.server = http.createServer(this.express);

    this.io = new SocketIOServer(this.server, {
      cors: { origin: 'http://localhost:5173/', methods: ['GET', 'POST'] },
    });

    this.io.on('connection', handleConnection);
  }

  async listen(): Promise<void> {
    await new Promise<void>(resolve => {
      this.server.listen(this.port, () => {
        console.log(
          `------------------------------------------------------------------------------------------
✅ Backend App is running at http://localhost:${
            this.port
          } in ${this.express.get('env')} mode
------------------------------------------------------------------------------------------`
        );
        console.log('✋ Press CTRL-C to stop\n');

        resolve();
      });
    });
  }
}
