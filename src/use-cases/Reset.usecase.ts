import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'

export class ResetUseCase {
  constructor(
    private accountsRepository: AccountsRepository,
    private transactionsRepository: TransactionsRepository
  ) {}

  async execute(): Promise<void> {
    await this.accountsRepository.deleteAll()
    await this.transactionsRepository.deleteAll()
  }
}
