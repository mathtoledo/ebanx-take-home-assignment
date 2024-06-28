import { Account } from '@/entities/Account'

export type CreateAccountInput = {
  destination: string
  amount: number
}

export abstract class AccountsRepository {
  abstract create({ destination, amount }: CreateAccountInput): Promise<Account>

  abstract findByAccountId(accountId: string): Promise<Account | null>

  abstract save(accountId: string, data: Partial<Account>): Promise<Account>
}
