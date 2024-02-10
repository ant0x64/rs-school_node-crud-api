export default class ModelError extends Error {
  constructor(message: string = 'Data integrity violated') {
    super(message);
  }
}

export class ModelErrorFields extends ModelError {
  constructor(
    message: string = 'Does not contain mandatory fields or has an invalid type',
  ) {
    super(message);
  }
}
