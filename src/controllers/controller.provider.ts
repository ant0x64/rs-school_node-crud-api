import ControllerInterface, {
  ControllerRoot,
  ControllerResponse,
} from './controller.interface';

import Database from './../services/db.service';

import { readdir } from 'node:fs/promises';
import { parse } from 'node:path';

class ControllersProvide {
  private controllers: {
    [key: ControllerRoot]: ControllerInterface<ControllerResponse>;
  } = {};

  async getControllers(database: Database<any>) {
    if (!Object.keys(this.controllers).length) {
      await readdir(__dirname).then(async (modules) => {
        for (const file of modules) {
          const name = parse(file).name;
          if (name.endsWith('.controller')) {
            const { default: Controller } = await import('./' + name);
            const controllerModel = new Controller(database);
            this.controllers[controllerModel.root] = controllerModel;
          }
        }
      });
    }
    return this.controllers;
  }
}

const controllersProvider = new ControllersProvide();
export default controllersProvider;
