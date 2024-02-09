export default class RequestError extends Error {
  constructor(message: string = 'Wrong request') {
    super(message);
  }
}
