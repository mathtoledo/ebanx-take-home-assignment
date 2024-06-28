import { Transaction } from '../../entities/Transaction'
import { CreateTransactionInput, TransactionsRepository } from '../TransactionsRepository'
import { v7 as uuidV7 } from 'uuid'

export class InMemoryTransactionsRepository implements TransactionsRepository {
  public transactions: Transaction[] = []

  create({ type, origin, destination, amount }: CreateTransactionInput): Promise<Transaction> {
    const data: Transaction = {
      id: uuidV7(),
      type,
      origin,
      destination,
      amount,
      createdAt: new Date(),
    }

    this.transactions.push(data)

    return Promise.resolve(data)
  }
}
