export class UserNotFoundError extends Error {
  constructor() {
    super('This user is not found.')
  }
}
