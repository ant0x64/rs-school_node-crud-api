export default class RequestError extends Error {
  constructor(message: string = 'Wrong Request') {
    super(message);
  }
}
