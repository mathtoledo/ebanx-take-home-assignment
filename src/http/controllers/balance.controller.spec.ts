import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Balance (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to retrieve the balance of an existing account', async () => {
    // First, deposit some money into an account to ensure it exists
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '200',
      amount: 150,
    })

    const response = await request(app.server).get('/balance').query({
      account_id: '200',
    })

    expect(response.status).toEqual(200)
    expect(response.body).toEqual(150)
  })

  it('should return 404 if the account does not exist', async () => {
    const response = await request(app.server).get('/balance').query({
      account_id: 'non-existent-account',
    })

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(0)
  })
})
