import dotenv from 'dotenv';
import { createServer } from 'http';
import ModelInterface from './src/models/model.interface';
import Database from './src/services/db.service';

import Router from './src/routers/main.router';

dotenv.config();

const router = new Router();
const database = new Database<ModelInterface>();

router.build(database).then(() => {
  const server = createServer((req, res) => {
    router.handle(req, res);
  });
  server.listen(process.env.HOST_PORT ?? 8000);
});
