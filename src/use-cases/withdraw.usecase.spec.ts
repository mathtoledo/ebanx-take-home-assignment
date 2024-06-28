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
    const existingAccount = { id: accountId, accountId, balance: 100 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)
    mockTransactionsRepository.create.mockResolvedValue({})
    mockAccountsRepository.save.mockResolvedValue({
      id: accountId,
      accountId,
      balance: 50,
    })

    const response = await withdrawUseCase.execute({ origin: accountId, amount })

    expect(response).toEqual({
      origin: {
        id: accountId,
        balance: 50,
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

  it('should throw AccountBalanceLessThanWithdrawAmountError if balance is less than the withdrawal amount', async () => {
    const accountId = 'existing-account-id'
    const amount = 150
    const existingAccount = { id: accountId, accountId, balance: 100 }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)

    await expect(withdrawUseCase.execute({ origin: accountId, amount })).rejects.toThrow(
      AccountBalanceLessThanWithdrawAmountError
    )
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
  })
})
