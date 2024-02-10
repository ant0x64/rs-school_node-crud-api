import dotenv from 'dotenv';
import Server from './services/server';

import ModelInterface from './models/model.interface';
import Database from './services/db.service';

dotenv.config();

const database = new Database<ModelInterface>();
const server = new Server(database);
const listener = server.run();

listener.listen(process.env.HOST_PORT ?? 3000);
