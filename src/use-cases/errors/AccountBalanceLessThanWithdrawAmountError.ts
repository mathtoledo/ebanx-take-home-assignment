import { UseCaseError } from '@/use-cases/errors/UseCaseError'

export class AccountBalanceLessThanWithdrawAmountError extends Error implements UseCaseError {
  constructor() {
    super('Insufficient funds for withdrawal')
  }
}
