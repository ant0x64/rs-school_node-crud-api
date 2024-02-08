import { v4 as uuid, validate } from 'uuid';
import { DatabaseErrorID } from './exceptions/database';
import ModelInterface from './model/interface';

export const validateUUID = validate;

export type UUID = ReturnType<typeof uuid>;

export class Database<ModelInterface> {
  protected data: { [key: UUID]: ModelInterface } = {};

  public add(row: ModelInterface): ModelInterface {
    const id: UUID = uuid();
    const model = { ...row, id } as ModelInterface;
    this.data[id] = model;
    return model;
  }

  public delete(id: UUID): boolean {
    this.checkId(id);
    return this.data[id] ? delete this.data[id] || true : false;
  }

  public update(id: UUID, row: ModelInterface): boolean {
    this.checkId(id);
    return this.data[id]
      ? true && (this.data[id] = { ...row, id } as ModelInterface) !== undefined
      : false;
  }

  public get(id: UUID): ModelInterface | undefined {
    this.checkId(id);
    return this.data[id];
  }

  public all(): ModelInterface[] {
    return Object.values(this.data);
  }

  private checkId(id: string) {
    if (validateUUID(id)) {
      throw new DatabaseErrorID();
    }
  }
}

const database = new Database<ModelInterface>();
export default database;
