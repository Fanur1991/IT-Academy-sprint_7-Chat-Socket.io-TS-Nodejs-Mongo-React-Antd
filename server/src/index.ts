import { Server } from './app/Server';
import mongoConnect from './config/mongoConfig';
import dotenv from 'dotenv';

dotenv.config();

export class App {
  server?: Server;
  mongo?: any;

  async start(): Promise<void> {
    const port = process.env.PORT || '8000';
    this.server = new Server(port);

    await mongoConnect();
    await this.server.listen();
  }
}

try {
  void new App().start();
} catch (e) {
  process.exit(1);
}

process.on('uncaughtException', () => {
  process.exit(1);
});
