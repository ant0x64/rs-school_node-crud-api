import dotenv from 'dotenv';
import { createServer } from 'http';

import Router from './src/router';

dotenv.config();

const router = new Router();
router.build().then(() => {
  const server = createServer((req, res) => {
    router.handle(req, res);
  });
  server.listen(process.env.HOST_PORT ?? 8000);
});
