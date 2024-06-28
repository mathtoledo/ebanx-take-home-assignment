import { UseCaseError } from '@/use-cases/errors/UseCaseError'

export class AccountBalanceLessThanTransferAmountError extends Error implements UseCaseError {
  constructor(balance: number, amount: number) {
    super(`Can't transfer ${amount} from account with balance ${balance}.`)
  }
}
