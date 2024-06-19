import { startServer } from './app/Server';
import mongoConnect from './config/mongoConfig';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || '5555';

const startApp = async (): Promise<void> => {
  try {
    await mongoConnect();
    await startServer(PORT);
  } catch (e) {
    process.exit(1);
  }
};

startApp();

process.on('uncaughtException', () => {
  process.exit(1);
});
