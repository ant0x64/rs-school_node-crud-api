import { createServer } from 'http';
import ModelInterface from './../models/model.interface';
import Database from './../services/db.service';

import Router from './../routers/main.router';

const router = new Router();
const database = new Database<ModelInterface>();

router.build(database);

const server = createServer((req, res) => {
  try {
    router.handle(req, res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end('Internal Server Error');
  }
});

export default server;
