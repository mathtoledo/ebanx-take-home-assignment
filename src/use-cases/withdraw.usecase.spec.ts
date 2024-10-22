import { describe, it, expect, vi, afterEach } from 'vitest'
import { WithdrawUseCase } from '@/use-cases/Withdraw.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'
import { AccountBalanceLessThanWithdrawAmountError } from '@/use-cases/errors/AccountBalanceLessThanWithdrawAmountError'

describe('WithdrawUseCase', () => {
  const mockAccountsRepository = {
    findByAccountId: vi.fn(),
    save: vi.fn(),
  }

  const mockTransactionsRepository = {
    create: vi.fn(),
  }

  const withdrawUseCase = new WithdrawUseCase(
    mockAccountsRepository as unknown as AccountsRepository,
    mockTransactionsRepository as unknown as TransactionsRepository
  )

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should successfully withdraw from an existing account with sufficient balance', async () => {
    const accountId = 'existing-account-id'
    const amount = 50
    const existingAccount = { id: accountId, accountId, balance: 100, credit: 1000 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)
    mockTransactionsRepository.create.mockResolvedValue({})
    mockAccountsRepository.save.mockResolvedValue({
      id: accountId,
      accountId,
      balance: 50,
      credit: 1000,
    })

    const response = await withdrawUseCase.execute({ origin: accountId, amount })

    expect(response).toEqual({
      origin: {
        id: accountId,
        balance: 50,
        credit: 1000,
      },
    })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
    expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
      type: 'withdraw',
      amount,
      origin: null,
      destination: accountId,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledWith(existingAccount.id, {
      ...existingAccount,
      balance: 50,
    })
  })

  it('should throw AccountNotFoundError if the account does not exist', async () => {
    const accountId = 'non-existent-account-id'
    const amount = 50

    mockAccountsRepository.findByAccountId.mockResolvedValue(null)

    await expect(withdrawUseCase.execute({ origin: accountId, amount })).rejects.toThrow(AccountNotFoundError)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
  })

  it('should successfully withdraw from an existing account with insufficient balance but within credit limit', async () => {
    const accountId = 'existing-account-id'
    const amount = 1200
    const existingAccount = { id: accountId, accountId, balance: 500, credit: 1000 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)
    mockTransactionsRepository.create.mockResolvedValue({})
    mockAccountsRepository.save.mockResolvedValue({
      id: accountId,
      accountId,
      balance: 0,
      credit: 300,
    })

    const response = await withdrawUseCase.execute({ origin: accountId, amount })

    expect(response).toEqual({
      origin: {
        id: accountId,
        balance: 0,
        credit: 300,
      },
    })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
    expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
      type: 'withdraw',
      amount,
      origin: null,
      destination: accountId,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledWith(existingAccount.id, {
      ...existingAccount,
      balance: 0,
      credit: 300,
    })
  })

  it('should throw AccountBalanceLessThanWithdrawAmountError if balance and credit are less than the withdrawal amount', async () => {
    const accountId = 'existing-account-id'
    const amount = 1300
    const existingAccount = { id: accountId, accountId, balance: 200, credit: 1000 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)

    await expect(withdrawUseCase.execute({ origin: accountId, amount })).rejects.toThrow(
      AccountBalanceLessThanWithdrawAmountError
    )
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
  })
})
