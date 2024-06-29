import { UseCaseError } from '@/use-cases/errors/UseCaseError'

export class AccountBalanceLessThanTransferAmountError extends Error implements UseCaseError {
  constructor() {
    super('Insufficient funds for transfer')
  }
}
