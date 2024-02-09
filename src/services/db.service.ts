import { v4 as uuid, validate } from 'uuid';
import { DatabaseErrorID } from './../exceptions/database.exception';

export const validateUUID = validate;

export type UUID = ReturnType<typeof uuid>;

export default class Database<T> {
  protected data: { [key: UUID]: T };

  constructor(data?: { [key: UUID]: T }) {
    this.data = data || {};
  }

  public add(row: T): T {
    const id: UUID = uuid();
    const model = { ...row, id } as T;
    this.data[id] = model;
    return model;
  }

  public delete(id: UUID): boolean {
    this.checkId(id);
    return this.data[id] ? delete this.data[id] || true : false;
  }

  public update(id: UUID, row: T): boolean {
    this.checkId(id);
    return this.data[id]
      ? true && (this.data[id] = { ...row, id } as T) !== undefined
      : false;
  }

  public get(id: UUID): T | undefined {
    this.checkId(id);
    return this.data[id];
  }

  public all(): T[] {
    return Object.values(this.data);
  }

  public merge(database: Database<T>) {
    this.data = database.data;
  }

  private checkId(id: string) {
    if (!validateUUID(id)) {
      throw new DatabaseErrorID();
    }
  }
}

export const globalDatabase = new Database();
