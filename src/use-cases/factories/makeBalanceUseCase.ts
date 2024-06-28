import { InMemoryAccountsRepository } from '@/repositories/in-memory/InMemoryAccountsRepository'
import { BalanceUseCase } from '@/use-cases/Balance.usecase'

export function makeBalanceUseCase() {
  const accountsRepository = new InMemoryAccountsRepository()

  const balanceUseCase = new BalanceUseCase(accountsRepository)

  return balanceUseCase
}
