import { UseCaseError } from '@/use-cases/errors/UseCaseError'

export class AccountNotFoundError extends Error implements UseCaseError {
  constructor() {
    super(`Account does not exist.`)
  }
}
