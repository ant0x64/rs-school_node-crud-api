export class ModelErrorFields extends Error {
  constructor(message: string = 'Wrong Request') {
    super(message);
  }
}
