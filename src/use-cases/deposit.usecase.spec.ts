import { describe, it, expect, vi, afterEach } from 'vitest'

import { DepositUseCase } from '@/use-cases/Deposit.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'

describe('DepositUseCase', () => {
  const mockAccountsRepository = {
    findByAccountId: vi.fn(),
    create: vi.fn(),
    save: vi.fn(),
  }

  const mockTransactionsRepository = {
    create: vi.fn(),
  }

  const depositUseCase = new DepositUseCase(
    mockAccountsRepository as unknown as AccountsRepository,
    mockTransactionsRepository as unknown as TransactionsRepository
  )

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should deposit into an existing account', async () => {
    const accountId = 'existing-account-id'
    const amount = 100
    const existingAccount = { id: accountId, accountId, balance: 200 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)
    mockTransactionsRepository.create.mockResolvedValue({})
    mockAccountsRepository.save.mockResolvedValue({
      id: accountId,
      accountId,
      balance: 300,
    })

    const response = await depositUseCase.execute({ destination: accountId, amount })

    expect(response).toEqual({
      destination: {
        id: accountId,
        balance: 300,
      },
    })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
    expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
      type: 'deposit',
      origin: null,
      destination: accountId,
      amount,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledWith(existingAccount.id, {
      balance: existingAccount.balance + amount,
    })
  })

  it('should create a new account and deposit if account does not exist', async () => {
    const accountId = 'new-account-id'
    const amount = 100

    mockAccountsRepository.findByAccountId.mockResolvedValue(null)
    mockAccountsRepository.create.mockResolvedValue({
      id: accountId,
      accountId,
      balance: amount,
    })

    const response = await depositUseCase.execute({ destination: accountId, amount })

    expect(response).toEqual({
      destination: {
        id: accountId,
        balance: amount,
      },
    })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
    expect(mockAccountsRepository.create).toHaveBeenCalledWith({
      destination: accountId,
      amount,
    })
    expect(mockTransactionsRepository.create).not.toHaveBeenCalled()
  })
})
