import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TransferUseCase } from '@/use-cases/Transfer.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'
import { AccountBalanceLessThanTransferAmountError } from '@/use-cases/errors/AccountBalanceLessThanTransferAmountError'

describe('TransferUseCase', () => {
  let mockAccountsRepository: any
  let mockTransactionsRepository: any
  let transferUseCase: TransferUseCase

  beforeEach(() => {
    mockAccountsRepository = {
      findByAccountId: vi.fn(),
      save: vi.fn(),
    }

    mockTransactionsRepository = {
      create: vi.fn(),
    }

    transferUseCase = new TransferUseCase(
      mockAccountsRepository as unknown as AccountsRepository,
      mockTransactionsRepository as unknown as TransactionsRepository
    )
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  it('should successfully transfer between two existing accounts with sufficient balance', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 50
    const originAccount = { id: originAccountId, accountId: originAccountId, balance: 100 }
    const destinationAccount = { id: destinationAccountId, accountId: destinationAccountId, balance: 50 }

    mockAccountsRepository.findByAccountId
      .mockResolvedValueOnce(originAccount)
      .mockResolvedValueOnce(destinationAccount)
    mockTransactionsRepository.create.mockResolvedValue({})
    mockAccountsRepository.save
      .mockResolvedValueOnce({ ...originAccount, balance: 50 })
      .mockResolvedValueOnce({ ...destinationAccount, balance: 100 })

    const response = await transferUseCase.execute({
      origin: originAccountId,
      amount,
      destination: destinationAccountId,
    })

    expect(response).toEqual({
      origin: {
        id: originAccountId,
        balance: 50,
      },
      destination: {
        id: destinationAccountId,
        balance: 100,
      },
    })
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
    expect(mockTransactionsRepository.create).toHaveBeenCalledWith({
      type: 'transfer',
      origin: originAccountId,
      destination: destinationAccountId,
      amount,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledWith(originAccount.id, {
      ...originAccount,
      balance: 50,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledWith(destinationAccount.id, {
      ...destinationAccount,
      balance: 100,
    })
  })

  it('should throw AccountNotFoundError if the origin account does not exist', async () => {
    const originAccountId = 'non-existent-origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 50

    mockAccountsRepository.findByAccountId
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ id: destinationAccountId, accountId: destinationAccountId, balance: 100 })

    await expect(
      transferUseCase.execute({ origin: originAccountId, amount, destination: destinationAccountId })
    ).rejects.toThrow(AccountNotFoundError)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).not.toHaveBeenCalledWith(destinationAccountId)
  })

  it('should throw AccountNotFoundError if the destination account does not exist', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'non-existent-destination-account-id'
    const amount = 50

    mockAccountsRepository.findByAccountId
      .mockResolvedValueOnce({ id: originAccountId, accountId: originAccountId, balance: 100 })
      .mockResolvedValueOnce(null)

    await expect(
      transferUseCase.execute({ origin: originAccountId, amount, destination: destinationAccountId })
    ).rejects.toThrow(AccountNotFoundError)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
  })

  it('should throw AccountBalanceLessThanTransferAmountError if origin account balance is less than the transfer amount', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 150
    const originAccount = { id: originAccountId, accountId: originAccountId, balance: 100 }
    const destinationAccount = { id: destinationAccountId, accountId: destinationAccountId, balance: 50 }

    mockAccountsRepository.findByAccountId
      .mockResolvedValueOnce(originAccount)
      .mockResolvedValueOnce(destinationAccount)

    await expect(
      transferUseCase.execute({ origin: originAccountId, amount, destination: destinationAccountId })
    ).rejects.toThrow(AccountBalanceLessThanTransferAmountError)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
  })
})
