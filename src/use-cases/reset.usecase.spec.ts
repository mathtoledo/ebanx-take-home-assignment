import { describe, it, expect, beforeEach, vi } from 'vitest'
import { ResetUseCase } from '@/use-cases/Reset.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'

describe('ResetUseCase', () => {
  let accountsRepository: AccountsRepository
  let transactionsRepository: TransactionsRepository
  let resetUseCase: ResetUseCase

  beforeEach(() => {
    accountsRepository = {
      deleteAll: vi.fn(),
    } as unknown as AccountsRepository

    transactionsRepository = {
      deleteAll: vi.fn(),
    } as unknown as TransactionsRepository

    resetUseCase = new ResetUseCase(accountsRepository, transactionsRepository)
  })

  it('should delete all accounts', async () => {
    await resetUseCase.execute()

    expect(accountsRepository.deleteAll).toHaveBeenCalledTimes(1)
  })

  it('should delete all transactions', async () => {
    await resetUseCase.execute()

    expect(transactionsRepository.deleteAll).toHaveBeenCalledTimes(1)
  })

  it('should delete all accounts before deleting transactions', async () => {
    const calls: string[] = []

    vi.spyOn(accountsRepository, 'deleteAll').mockImplementation(() => {
      calls.push('accounts')
      return Promise.resolve()
    })

    vi.spyOn(transactionsRepository, 'deleteAll').mockImplementation(() => {
      calls.push('transactions')
      return Promise.resolve()
    })

    await resetUseCase.execute()

    expect(calls).toEqual(['accounts', 'transactions'])
  })
})
