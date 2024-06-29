import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { TransferUseCase } from '@/use-cases/Transfer.usecase'
import { AccountsRepository } from '@/repositories/AccountsRepository'
import { TransactionsRepository } from '@/repositories/TransactionsRepository'
import { AccountNotFoundError } from '@/use-cases/errors/AccountNotFoundError'
import { AccountBalanceLessThanTransferAmountError } from '@/use-cases/errors/AccountBalanceLessThanTransferAmountError'

interface MockAccountsRepository {
  create: ReturnType<typeof vi.fn>
  findByAccountId: ReturnType<typeof vi.fn>
  save: ReturnType<typeof vi.fn>
}

interface MockTransactionsRepository {
  create: ReturnType<typeof vi.fn>
}

describe('TransferUseCase', () => {
  let mockAccountsRepository: MockAccountsRepository
  let mockTransactionsRepository: MockTransactionsRepository
  let transferUseCase: TransferUseCase

  beforeEach(() => {
    mockAccountsRepository = {
      create: vi.fn(),
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

  it('should transfer successfully between existing accounts', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 50

    const originAccount = { id: '1', accountId: originAccountId, balance: 100 }
    const destinationAccount = { id: '2', accountId: destinationAccountId, balance: 0 }

    mockAccountsRepository.findByAccountId
      .mockResolvedValueOnce(originAccount)
      .mockResolvedValueOnce(destinationAccount)

    mockAccountsRepository.save.mockResolvedValueOnce({
      ...originAccount,
      balance: originAccount.balance - amount,
    })
    mockAccountsRepository.save.mockResolvedValueOnce({
      ...destinationAccount,
      balance: destinationAccount.balance + amount,
    })

    const response = await transferUseCase.execute({
      origin: originAccountId,
      amount,
      destination: destinationAccountId,
    })

    expect(response).toEqual({
      origin: {
        id: originAccount.accountId,
        balance: originAccount.balance - amount,
      },
      destination: {
        id: destinationAccount.accountId,
        balance: destinationAccount.balance + amount,
      },
    })

    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
    expect(mockAccountsRepository.save).toHaveBeenCalledTimes(2)
  })

  it('should create destination account and transfer when destination account does not exist', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 50

    const originAccount = { id: '1', accountId: originAccountId, balance: 100 }
    const createdDestinationAccount = { id: '2', accountId: destinationAccountId, balance: 0 }

    mockAccountsRepository.findByAccountId.mockResolvedValueOnce(originAccount).mockResolvedValueOnce(null)

    mockAccountsRepository.create.mockResolvedValueOnce(createdDestinationAccount)
    mockAccountsRepository.save.mockResolvedValueOnce({
      ...originAccount,
      balance: originAccount.balance - amount,
    })
    mockAccountsRepository.save.mockResolvedValueOnce({
      ...createdDestinationAccount,
      balance: createdDestinationAccount.balance + amount,
    })

    const response = await transferUseCase.execute({
      origin: originAccountId,
      amount,
      destination: destinationAccountId,
    })

    expect(response).toEqual({
      origin: {
        id: originAccount.accountId,
        balance: originAccount.balance - amount,
      },
      destination: {
        id: createdDestinationAccount.accountId,
        balance: createdDestinationAccount.balance + amount,
      },
    })

    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
    expect(mockAccountsRepository.create).toHaveBeenCalledWith({
      destination: destinationAccountId,
      amount: 0,
    })
    expect(mockAccountsRepository.save).toHaveBeenCalledTimes(2)
  })

  it('should throw AccountNotFoundError if origin account does not exist', async () => {
    const originAccountId = 'non-existent-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 50

    mockAccountsRepository.findByAccountId.mockResolvedValueOnce(null)

    await expect(
      transferUseCase.execute({
        origin: originAccountId,
        amount,
        destination: destinationAccountId,
      })
    ).rejects.toThrow(AccountNotFoundError)

    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).not.toHaveBeenCalledWith(destinationAccountId)
    expect(mockAccountsRepository.create).not.toHaveBeenCalled()
    expect(mockAccountsRepository.save).not.toHaveBeenCalled()
  })

  it('should throw AccountBalanceLessThanTransferAmountError if origin account balance is less than transfer amount', async () => {
    const originAccountId = 'origin-account-id'
    const destinationAccountId = 'destination-account-id'
    const amount = 150
    const originAccount = { id: '1', accountId: originAccountId, balance: 100 }

    mockAccountsRepository.findByAccountId.mockResolvedValueOnce(originAccount).mockResolvedValueOnce(null)

    await expect(
      transferUseCase.execute({
        origin: originAccountId,
        amount,
        destination: destinationAccountId,
      })
    ).rejects.toThrow(AccountBalanceLessThanTransferAmountError)

    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(originAccountId)
    expect(mockAccountsRepository.findByAccountId).toHaveBeenCalledWith(destinationAccountId)
    expect(mockAccountsRepository.create).toHaveBeenCalled()
    expect(mockAccountsRepository.save).not.toHaveBeenCalled()
  })
})
