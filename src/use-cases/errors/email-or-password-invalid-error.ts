export class EmailOrPasswordInvalidError extends Error {
  constructor() {
    super('E-mail and/or password invalid.')
  }
}
