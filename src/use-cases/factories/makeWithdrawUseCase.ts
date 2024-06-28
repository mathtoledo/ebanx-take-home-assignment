import { InMemoryAccountsRepository } from '@/repositories/in-memory/InMemoryAccountsRepository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/InMemoryTransactionsRepository'
import { WithdrawUseCase } from '@/use-cases/Withdraw.usecase'

export function makeWithdrawUseCase() {
  const accountsRepository = new InMemoryAccountsRepository()
  const transactionsRepository = new InMemoryTransactionsRepository()

  const withdrawUseCase = new WithdrawUseCase(accountsRepository, transactionsRepository)

  return withdrawUseCase
}
