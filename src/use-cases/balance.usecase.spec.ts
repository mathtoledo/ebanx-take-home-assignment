import { describe, it, expect, vi, afterEach } from 'vitest'
import { BalanceUseCase } from '@/use-cases/Balance.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'

describe('BalanceUseCase', () => {
  const mockAccountsRepository = {
    findByAccountId: vi.fn(),
  }

  const balanceUseCase = new BalanceUseCase(mockAccountsRepository as unknown as AccountsRepository)

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('should retrieve the balance of an existing account', async () => {
    const accountId = 'existing-account-id'
    const balance = 200
    const existingAccount = { id: accountId, accountId, balance }

    mockAccountsRepository.findByAccountId.mockResolvedValue(existingAccount)

    const response = await balanceUseCase.execute({ accountId })

    expect(response).toEqual({ balance })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
  })

  it('should throw AccountNotFoundError if the account does not exist', async () => {
    const accountId = 'non-existent-account-id'

    mockAccountsRepository.findByAccountId.mockResolvedValue(null)

    await expect(balanceUseCase.execute({ accountId })).rejects.toThrow(AccountNotFoundError)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(accountId)
  })
})
