import { v7 as uuidV7 } from 'uuid'
import { AccountsRepository, CreateAccountInput } from '../AccountsRepository'
import { Account } from '@/entities/Account'

export class InMemoryAccountsRepository implements AccountsRepository {
  constructor(private accounts: Account[]) {}

  create({ destination, amount }: CreateAccountInput): Promise<Account> {
    const data: Account = {
      id: uuidV7(),
      accountId: destination,
      balance: amount,
    }

    this.accounts.push(data)

    return Promise.resolve(data)
  }

  findByAccountId(accountId: string): Promise<Account | null> {
    const account = this.accounts.find((a) => a.accountId === accountId)

    if (!account) {
      return Promise.resolve(null)
    }

    return Promise.resolve(account)
  }

  save(id: string, data: Partial<Account>): Promise<Account> {
    const accountIndex = this.accounts.findIndex((a) => a.id === id)

    if (accountIndex === -1) {
      throw new Error('Account not found')
    }

    this.accounts[accountIndex] = { ...this.accounts[accountIndex], ...data }

    return Promise.resolve(this.accounts[accountIndex])
  }
}
