import { Transaction } from '@/entities/Transaction'
import { CreateTransactionInput, TransactionsRepository } from '../TransactionsRepository'
import { v7 as uuidV7 } from 'uuid'

let transactions: Transaction[] = []

export class InMemoryTransactionsRepository implements TransactionsRepository {
  create({ type, origin, destination, amount }: CreateTransactionInput): Promise<Transaction> {
    const data: Transaction = {
      id: uuidV7(),
      type,
      origin,
      destination,
      amount,
      createdAt: new Date(),
    }

    transactions.push(data)

    return Promise.resolve(data)
  }

  async deleteAll(): Promise<void> {
    transactions = []
  }
}
