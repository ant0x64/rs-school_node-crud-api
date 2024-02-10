import cluster, { Worker } from 'node:cluster';

import dotenv from 'dotenv';
import { createServer, request, RequestOptions } from 'node:http';
import Server from './services/server';
import { availableParallelism } from 'node:os';

import Database from './services/db.service';

dotenv.config();

if (cluster.isPrimary) {
  const CLUSTER_PORT: number = parseInt(process.env.CLUSTER_PORT ?? '') ?? 4000;
  const AVAILABLE_WORKERS = availableParallelism() - 1;
  const database = new Database();

  console.log(`Cluster created`);
  for (let i = 0; i <= AVAILABLE_WORKERS; i++) {
    const port = CLUSTER_PORT + 1 + i;
    const worker = cluster.fork({ HOST_PORT: port });
    console.log(`Worker run on the port: ${port}`);
    worker.send(database);

    worker.on('exit', (code) => {
      console.error(
        `Worker on the port ${port} existed with the code: ${code}`,
      );
      cluster.fork({ HOST_PORT: port });
      worker.send(database);

      console.log(`Worker run on the port: ${port}`);
    });
  }

  cluster.on('message', (messagedWorker: Worker, workerDatabase: object) => {
    if (!workerDatabase || !workerDatabase.hasOwnProperty('data')) {
      return;
    }
    database.merge(workerDatabase as Database<any>);
    for (const worker_id in cluster.workers) {
      const worker = cluster.workers[worker_id];
      if (worker && worker !== messagedWorker) {
        worker.send(database);
      }
    }
    console.log(`Database updated from the worker`);
  });

  let worker_index: number;
  const clusterServer = createServer((req, res) => {
    worker_index = ((worker_index || 0) % AVAILABLE_WORKERS) + 1;

    console.log(`Cluster get a request`);

    new Promise(() => {
      const WORKER_PORT = CLUSTER_PORT + worker_index;

      console.log(`Cluster creates a request to the port: ${WORKER_PORT}`);
      const requestToWorker = request(
        {
          port: WORKER_PORT,
          host: req.headers.host?.split(':')[0],
          path: req.url,
          method: req.method,
          headers: req.headers,
        } as RequestOptions,
        (workerResponce) => {
          console.log(`Cluster proxied a request to the port: ${WORKER_PORT}`);
          res.writeHead(
            workerResponce.statusCode ?? 500,
            workerResponce.headers,
          );
          workerResponce.pipe(res);
        },
      );
      req.pipe(requestToWorker);
      res.on('finish', () => {
        console.log(`Cluster finished a request on the port: ${WORKER_PORT}`);
      });

      requestToWorker.on('error', () => {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('Internal Server Error');
      });
    });
  });

  clusterServer.listen(CLUSTER_PORT, () => {
    console.log(`Cluster listening on the port: ${CLUSTER_PORT}`);
  });
} else {
  const HOST_PORT: number = parseInt(process.env.HOST_PORT ?? '') ?? 4000;
  const database = new Database();
  const server = new Server(database);

  // const hostServer = createServer(({}, res) => {
  //   setTimeout(() => {
  //     res.end('end ' + HOST_PORT);
  //   }, 5000);
  // });
  // hostServer.listen(HOST_PORT);

  const listener = server.run().on('request', ({}, res) => {
    res.on('finish', () => {
      process.send ? process.send(database) : null;
    });
  });

  console.log(`Worker listening on the port: ${HOST_PORT}`);
  listener.listen(HOST_PORT ?? 3500);

  process.on('message', (parentDatabase: Database<any>) => {
    database.merge(parentDatabase);
    console.log(`Worker database updated on the port: ${HOST_PORT}`);
  });
}
