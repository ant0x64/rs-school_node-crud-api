export type ControllerRoot = `/${string}`;

export type ControllerResponse = {
  result: object;
  code: 200 | 201 | 204 | 400 | 404 | 500;
  message?: string;
};

export enum RequestMethodMapper {
  GET = '_handleGet',
  POST = '_handlePost',
  PUT = '_handlePut',
  DELETE = '_handleDelete',
}

export default interface ControllerInterface<T> {
  root: ControllerRoot;
  proceed(method: string, params?: string[], data?: object): T;
}
