import { IncomingMessage, ServerResponse } from 'node:http';
import ControllerInterface, {
  ControllerResponse,
  ControllerRoot,
} from './../controllers/controller.interface';
import controllersProvider from './../controllers/controller.provider';

import Database from './../services/db.service';

export default class Router {
  protected controllers: {
    [key: ControllerRoot]: ControllerInterface<ControllerResponse>;
  } = {};

  async build(database: Database<any>) {
    this.controllers = await controllersProvider.getControllers(database);
  }

  handle(req: IncomingMessage, res: ServerResponse): void {
    let result: ControllerResponse | null = null;
    let data: string = '';

    res.setHeader('Content-Type', 'application/json');

    req.on('data', (chunk) => {
      data += chunk.toString();
    });

    req.on('end', () => {
      if (req.method) {
        for (const [key, controller] of Object.entries(this.controllers)) {
          if (req.url && `${req.url}/`.startsWith(`${key}/`)) {
            const regex = new RegExp(`^${key}(\/)?`);
            const params = req.url
              .replace(regex, '')
              .split('/')
              .filter((val) => val && val !== '');

            result = controller.proceed(
              req.method,
              params,
              data ? JSON.parse(data) : {},
            );
          }
        }
      }

      if (!result) {
        result = {
          code: 404,
          message: 'Controller not found',
        } as ControllerResponse;
      }

      res.statusCode = result.code;
      res.write(
        JSON.stringify({
          result: result.result,
          message: result.message,
        }),
      );

      res.end();
    });
  }
}
