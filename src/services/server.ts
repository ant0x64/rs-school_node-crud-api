import { createServer, ServerResponse } from 'node:http';

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
      req.on('error', () => {
        this.serverError(res);
      });
      try {
        this.router.handle(req, res);
      } catch (err) {
        this.serverError(res);
      }
    });
  }

  protected serverError(res: ServerResponse) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Internal Server Error');
  }
}
