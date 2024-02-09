import dotenv from 'dotenv';
import server from './services/server';

dotenv.config();
server.listen(process.env.HOST_PORT ?? 3500);
