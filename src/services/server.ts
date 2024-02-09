import { createServer } from 'http';

import Router from './../routers/main.router';
import Database from './../services/db.service';

export default class Server {
  router: Router;

  constructor(database: Database<any>) {
    this.router = new Router();
    this.router.build(database);
  }

  run() {
    return createServer((req, res) => {
      try {
        this.router.handle(req, res);
      } catch (err) {
        res.writeHead(500, { 'Content-Type': 'text/html' });
        res.end('Internal Server Error');
      }
    });
  }
}
