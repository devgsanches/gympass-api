export class CheckinAlreadyExistsError extends Error {
  constructor() {
    super("You've already checked in today.")
  }
}
