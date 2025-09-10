export class ResourceNotFoundError extends Error {
  constructor(message?: string) {
    super(message ? message : 'Resource not found.')
  }
}
