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

    if (account.balance < amount) {
      throw new AccountBalanceLessThanWithdrawAmountError(account.balance, amount)
    }

    const balance = account.balance - amount

    await this.transactionsRepository.create({
      type: 'withdraw',
      amount,
      origin: null,
      destination: accountId,
    })

    await this.accountsRepository.save(account.id, { ...account, balance })

    return {
      origin: {
        id: accountId,
        balance,
      },
    }
  }
}
