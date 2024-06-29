import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Reset (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to reset all accounts and transactions', async () => {
    // First, deposit some money into an account to ensure there are accounts and transactions
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '300',
      amount: 150,
    })

    // Ensure the account exists
    let response = await request(app.server).get('/balance').query({
      account_id: '300',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(150)

    // Perform the reset
    response = await request(app.server).post('/reset').send()

    expect(response.status).toEqual(200)

    // Check if the account has been deleted
    response = await request(app.server).get('/balance').query({
      account_id: '300',
    })

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(0)
  })
})
