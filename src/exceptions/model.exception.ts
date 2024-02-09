export default class ModelError extends Error {
  constructor(message: string = 'Data integrity violated') {
    super(message);
  }
}

export class ModelErrorFields extends ModelError {
  constructor(message: string = 'Does not contain required fields') {
    super(message);
  }
}
export class ModelErrorID extends ModelError {
  constructor(message: string = 'ID has incorrect format') {
    super(message);
  }
}
