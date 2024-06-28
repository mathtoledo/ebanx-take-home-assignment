import { InMemoryAccountsRepository } from '@/repositories/in-memory/InMemoryAccountsRepository'
import { InMemoryTransactionsRepository } from '@/repositories/in-memory/InMemoryTransactionsRepository'
import { TransferUseCase } from '@/use-cases/Transfer.usecase'

export function makeTransferUseCase() {
  const accountsRepository = new InMemoryAccountsRepository()
  const transactionsRepository = new InMemoryTransactionsRepository()

  const trasnferUseCase = new TransferUseCase(accountsRepository, transactionsRepository)

  return trasnferUseCase
}
