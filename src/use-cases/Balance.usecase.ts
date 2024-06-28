import { AccountsRepository } from '@/repositories/AccountsRepository'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'

interface BalanceUseCaseRequest {
  accountId: string
}

type BalanceUseCaseResponse = {
  balance: number
}

export class BalanceUseCase {
  constructor(private accountsRepository: AccountsRepository) {}

  async execute(request: BalanceUseCaseRequest): Promise<BalanceUseCaseResponse> {
    const { accountId } = request

    const account = await this.accountsRepository.findByAccountId(accountId)

    if (!account) {
      throw new AccountNotFoundError()
    }

    const { balance } = account

    return { balance }
  }
}
