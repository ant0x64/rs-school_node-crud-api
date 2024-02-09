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
    try {
      router.handle(req, res);
    } catch (err) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end('Internal Server Error');
    }
  });
  server.listen(process.env.HOST_PORT ?? 3500);
});
