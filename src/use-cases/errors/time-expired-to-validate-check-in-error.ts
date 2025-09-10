export class MaxTimeToValidateCheckInError extends Error {
    constructor() {
      super('The check-in can only be validated up to 20 minutes after it was created.')
    }
  }
  