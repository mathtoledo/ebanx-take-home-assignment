import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'

interface DepositUseCaseRequest {
  destination: string
  amount: number
}

type DepositUseCaseResponse = {
  destination: {
    id: string
    balance: number
  }
}

export class DepositUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository
  ) {}

  async execute(request: DepositUseCaseRequest): Promise<DepositUseCaseResponse> {
    const { destination: accountId, amount } = request

    const accountExists = await this.accountsRepository.findByAccountId(accountId)

    if (!accountExists) {
      const newAccount = await this.accountsRepository.create({ destination: accountId, amount })
      return {
        destination: {
          id: newAccount.accountId,
          balance: newAccount.balance,
        },
      }
    }

    await this.transactionsRepository.create({
      type: 'deposit',
      origin: null,
      destination: accountId,
      amount,
    })

    const account = await this.accountsRepository.save(accountExists.id, {
      balance: accountExists.balance + amount,
    })

    return {
      destination: {
        id: account.accountId,
        balance: account.balance,
      },
    }
  }
}
