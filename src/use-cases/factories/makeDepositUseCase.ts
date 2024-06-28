import { InMemoryAccountsRepository } from '@/repositories/in-memory/InMemoryAccountsRepository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/InMemoryTransactionsRepository'
import { DepositUseCase } from '@/use-cases/Deposit.usecase'

export function makeDepositUseCase() {
  const accountsRepository = new InMemoryAccountsRepository()
  const transactionsRepository = new InMemoryTransactionsRepository()

  const depositUseCase = new DepositUseCase(accountsRepository, transactionsRepository)

  return depositUseCase
}
