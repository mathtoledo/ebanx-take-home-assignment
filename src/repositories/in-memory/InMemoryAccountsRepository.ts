import { v7 as uuidV7 } from 'uuid'
import { AccountsRepository, CreateAccountInput } from '../AccountsRepository'
import { Account } from '@/entities/Account'

let accounts: Account[] = []
export class InMemoryAccountsRepository implements AccountsRepository {
  constructor() {}

  create({ destination, amount }: CreateAccountInput): Promise<Account> {
    const data: Account = {
      id: uuidV7(),
      accountId: destination,
      balance: amount,
      credit: 1000,
    }

    accounts.push(data)

    return Promise.resolve(data)
  }

  findByAccountId(accountId: string): Promise<Account | null> {
    const account = accounts.find((a) => a.accountId === accountId)

    if (!account) {
      return Promise.resolve(null)
    }

    return Promise.resolve(account)
  }

  save(id: string, data: Partial<Account>): Promise<Account> {
    const accountIndex = accounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      throw new Error('Account not found')
    }

    accounts[accountIndex] = { ...accounts[accountIndex], ...data }

    return Promise.resolve(accounts[accountIndex])
  }

  async deleteAll(): Promise<void> {
    accounts = []
  }
}
