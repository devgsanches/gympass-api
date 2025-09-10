import { expect, describe, it, beforeEach, afterEach, vi } from 'vitest'
import { InMemoryCheckInsRepository } from '@/repositories/in-memory/in-memory-check-ins-repository'
import { ValidateCheckInUseCase } from '../validate-check-in'
import { ResourceNotFoundError } from '../errors/resource-not-found-error'
import { ValidateCheckInError } from '../errors/validate-check-in-error'
import { MaxTimeToValidateCheckInError } from '../errors/time-expired-to-validate-check-in-error'

describe('Validate Check In Use Case', () => {
  let checkinsRepository: InMemoryCheckInsRepository
  let sut: ValidateCheckInUseCase

  beforeEach(async () => {
    checkinsRepository = new InMemoryCheckInsRepository()
    sut = new ValidateCheckInUseCase(checkinsRepository)

    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should be able to validate a check in', async () => {
    const checkIn = await checkinsRepository.create({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    const { checkInValidated } = await sut.execute({
      checkInId: checkIn.id,
    })

    expect(checkInValidated.validatedAt).toEqual(expect.any(Date))
  })

  it('should fail when trying to validate a checkin after 20 minutes', async () => {
    const date = new Date(2025, 8, 3, 10, 40, 0)
    vi.setSystemTime(date)

    // a data do checkin será 10:40:00, pois o sistema está com o fake time, então caso eu tenha criado uma data fake (vi.setSystemTime(date)), a data do checkin será essa data fake, caso não, será criada conforme está declarada em meu schema > data atual
    const checkIn = await checkinsRepository.create({
      userId: 'user-01',
      gymId: 'gym-01',
    })

    const twentyOneMinutesInMs = 1000 * 60 * 21
    vi.advanceTimersByTime(twentyOneMinutesInMs)
    // esse advanceTimersByTime avança o tempo da data atual, não da data de criação do checkin

    await expect(() =>
      sut.execute({
        checkInId: checkIn.id,
      })
    ).rejects.toBeInstanceOf(MaxTimeToValidateCheckInError)
  })

  it('should not be able to validate a check in that does not exist', async () => {
    await expect(() =>
      sut.execute({
        checkInId: 'non-existing-id',
      })
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
