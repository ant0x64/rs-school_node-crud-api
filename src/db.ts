import { v4 as uuid } from 'uuid';

export type UUID = ReturnType<typeof uuid>;

export default class Dabasbase<T extends { id?: UUID }> {
  protected data: { [key: UUID]: T } = {};

  public add(row: T): UUID {
    const id: UUID = uuid();
    this.data[id] = { ...row, id } as T;
    return id;
  }

  public delete(id: UUID): boolean {
    return this.data[id] ? delete this.data[id] || true : false;
  }

  public update(id: UUID, row: T): boolean {
    return this.data[id]
      ? true && (this.data[id] = { ...row, id } as T) !== undefined
      : false;
  }

  public get(id: UUID): T | undefined {
    return this.data[id];
  }

  public all(): T[] {
    return Object.values(this.data);
  }
}
