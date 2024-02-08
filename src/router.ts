import { IncomingMessage, ServerResponse } from 'node:http';
import ControllerInterface, {
  ControllerResponse,
  ControllerRoot,
} from './controller/intarface';

import controllersProvider from './controller/provider';

export default class Router {
  protected controllers: {
    [key: ControllerRoot]: ControllerInterface<ControllerResponse>;
  } = {};

  async build() {
    this.controllers = await controllersProvider.getControllers();
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
            try {
              const regex = new RegExp(`^${key}`);
              const params = req.url.replace(regex, '').split('/');
              result = controller.proceed(
                req.method,
                params,
                data ? JSON.parse(data) : {},
              );
            } catch (err) {
              result = {
                code: 500,
                message:
                  err instanceof Error
                    ? err.message
                    : err instanceof String
                      ? err
                      : (err as string),
              } as ControllerResponse;
            }
          }
        }
      }

      if (!result) {
        result = {
          code: 500,
          message: 'Controller not found',
        } as ControllerResponse;
      }

      res.setHeader('statusCode', result.code);
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
