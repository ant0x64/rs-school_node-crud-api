export class DatabaseErrorID extends Error {
  constructor(message: string = 'Wrong ID parameter') {
    super(message);
  }
}
