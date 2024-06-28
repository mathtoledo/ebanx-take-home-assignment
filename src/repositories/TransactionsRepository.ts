import { Transaction } from '@/entities/Transaction'

export type CreateTransactionInput = {
  type: 'deposit' | 'withdraw' | 'transfer'
  origin: string | null
  destination: string
  amount: number
}

export abstract class TransactionsRepository {
  abstract create({ type, destination, amount }: CreateTransactionInput): Promise<Transaction>
}
