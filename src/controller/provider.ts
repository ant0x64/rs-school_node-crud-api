import ControllerInterface, {
  ControllerRoot,
  ControllerResponse,
} from './intarface';
import { readdir } from 'fs/promises';
import { parse } from 'path';

class ControllersProvide {
  private controllers: {
    [key: ControllerRoot]: ControllerInterface<ControllerResponse>;
  } = {};

  async getControllers() {
    if (!Object.keys(this.controllers).length) {
      await readdir(__dirname).then(async (modules) => {
        for (const file of modules) {
          const name = parse(file).name;
          if (name.endsWith('Controller')) {
            const { default: Controller } = await import('./' + name);
            const controllerModel = new Controller();
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
