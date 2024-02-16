import dotenv from 'dotenv';

import App from './app';

import { createServer } from 'node:http';
import Database from './services/db.service';

dotenv.config();

const database = new Database();
const app = new App(database);

const server = createServer((req, res) => {
  req.on('error', (err) => {
    res.writeHead(500);
    res.end(err.message);
  });
  app.handleHttp(req, res);
});

server.listen(process.env.HOST_PORT ?? 3000);
