import { UseCaseError } from '@/use-cases/errors/UseCaseError'

export class AccountBalanceLessThanWithdrawAmountError extends Error implements UseCaseError {
  constructor(balance: number, amount: number) {
    super(`Can't withdraw ${amount} from account with balance ${balance}.`)
  }
}
