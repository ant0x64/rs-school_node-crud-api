import dotenv from 'dotenv';
import app from './app';

dotenv.config();
server.listen(process.env.HOST_PORT ?? 3500);
