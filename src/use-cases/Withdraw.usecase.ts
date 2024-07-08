import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'
import { AccountBalanceLessThanWithdrawAmountError } from '@/use-cases/errors/AccountBalanceLessThanWithdrawAmountError'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'

interface WithdrawUseCaseRequest {
  origin: string
  amount: number
}

type WithdrawUseCaseResponse = {
  origin: {
    id: string
    balance: number
    credit: number
  }
}

export class WithdrawUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository
  ) {}

  async execute(request: WithdrawUseCaseRequest): Promise<WithdrawUseCaseResponse> {
    const { origin: accountId, amount } = request

    const account = await this.accountsRepository.findByAccountId(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const totalAvailableFunds = account.balance + account.credit

    if (totalAvailableFunds < amount) {
      throw new AccountBalanceLessThanWithdrawAmountError()
    }

    let newBalance = account.balance - amount
    let newCredit = account.credit

    if (newBalance < 0) {
      newCredit += newBalance // newBalance is negative, so this subtracts from credit
      newBalance = 0
    }

    await this.transactionsRepository.create({
      type: 'withdraw',
      amount,
      origin: null,
      destination: accountId,
    })

    await this.accountsRepository.save(account.id, { ...account, balance: newBalance, credit: newCredit })

    return {
      origin: {
        id: accountId,
        balance: newBalance,
        credit: newCredit,
      },
    }
  }
}
