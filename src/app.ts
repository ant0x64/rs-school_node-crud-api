import { ServerResponse, IncomingMessage } from 'node:http';

import Router from './routers/main.router';
import Database from './services/db.service';

export default class App {
  private router: Router;

  constructor(database: Database<any>) {
    this.router = new Router();
    this.router.build(database);
  }

  handleHttp(req: IncomingMessage, res: ServerResponse) {
    try {
      this.router.handle(req, res);
    } catch (err) {
      req.emit('error', err);
    }
  }
}
