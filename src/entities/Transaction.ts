export interface Transaction {
  id: string
  type: 'deposit' | 'withdraw' | 'transfer'
  origin: string | null
  destination: string
  amount: number
  createdAt: Date
}
