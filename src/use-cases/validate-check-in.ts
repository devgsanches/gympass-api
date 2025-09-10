import type { CheckIn } from 'generated/prisma'
import type { ICheckInsRepository } from '@/repositories/interfaces/check-ins-repository'
import { ResourceNotFoundError } from './errors/resource-not-found-error'
import dayjs from 'dayjs'
import { MaxTimeToValidateCheckInError } from './errors/time-expired-to-validate-check-in-error'
import { ValidateCheckInError } from './errors/validate-check-in-error'

interface IValidateCheckInRequest {
  checkInId: string
}

interface IValidateCheckInResponse {
  checkInValidated: CheckIn
}

export class ValidateCheckInUseCase {
  constructor(private checkinsRepository: ICheckInsRepository) {}

  async execute({
    checkInId,
  }: IValidateCheckInRequest): Promise<IValidateCheckInResponse> {
    const checkIn = await this.checkinsRepository.findById(checkInId)

    if (!checkIn) {
      throw new ResourceNotFoundError(
        `Check-in with id ${checkInId} not found.`
      )
    }

    const dateDiffInMinutes = dayjs().diff(checkIn.createdAt, 'minute')

    const MAX_MINUTES_TO_VALIDATE_CHECK_IN = 20

    if (dateDiffInMinutes > MAX_MINUTES_TO_VALIDATE_CHECK_IN) {
      throw new MaxTimeToValidateCheckInError()
    }

    // verify role of user: admin
    // if (role !== 'admin') {
    //     throw new UnauthorizedError()
    // }

    const checkInValidated = await this.checkinsRepository.validate(checkIn.id)

    return {
      checkInValidated,
    }
  }
}
