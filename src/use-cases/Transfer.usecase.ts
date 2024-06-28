import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'
import { AccountBalanceLessThanTransferAmountError } from '@/use-cases/errors/AccountBalanceLessThanTransferAmountError'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'

interface TransferUseCaseRequest {
  origin: string
  amount: number
  destination: string
}

type TransferUseCaseResponse = {
  origin: {
    id: string
    balance: number
  }
  destination: {
    id: string
    balance: number
  }
}

export class TransferUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository
  ) {}

  async execute(request: TransferUseCaseRequest): Promise<TransferUseCaseResponse> {
    const { origin: originAccountId, amount, destination: destinationAccountId } = request

    let originAccount = await this.accountsRepository.findByAccountId(originAccountId)

    if (!originAccount) {
      throw new AccountNotFoundError()
    }

    let destinationAccount = await this.accountsRepository.findByAccountId(destinationAccountId)

    if (!destinationAccount) {
      throw new AccountNotFoundError()
    }

    if (originAccount.balance < amount) {
      throw new AccountBalanceLessThanTransferAmountError(originAccount.balance, amount)
    }

    await this.transactionsRepository.create({
      type: 'transfer',
      origin: originAccountId,
      destination: destinationAccountId,
      amount,
    })

    originAccount = await this.accountsRepository.save(originAccount.id, {
      ...originAccount,
      balance: originAccount.balance - amount,
    })

    destinationAccount = await this.accountsRepository.save(destinationAccount.id, {
      ...destinationAccount,
      balance: destinationAccount.balance + amount,
    })

    return {
      origin: {
        id: originAccount.accountId,
        balance: originAccount.balance,
      },
      destination: {
        id: destinationAccount.accountId,
        balance: destinationAccount.balance,
      },
    }
  }
}
