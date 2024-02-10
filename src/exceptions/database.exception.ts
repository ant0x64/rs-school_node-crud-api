export class DatabaseErrorID extends Error {
  constructor(message: string = 'The identifier parameter is not correct') {
    super(message);
  }
}
