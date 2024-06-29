import request from 'supertest'
import { app } from '@/app'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('Event (e2e)', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to deposit into an account', async () => {
    const response = await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '100',
      amount: 100,
    })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      destination: {
        id: '100',
        balance: 100,
      },
    })
  })

  it('should be able to withdraw from an account', async () => {
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '101',
      amount: 200,
    })

    const response = await request(app.server).post('/event').send({
      type: 'withdraw',
      origin: '101',
      amount: 100,
    })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      origin: {
        id: '101',
        balance: 100,
      },
    })
  })

  it('should not be able to withdraw if the account does not exist', async () => {
    const response = await request(app.server).post('/event').send({
      type: 'withdraw',
      origin: 'non-existent-account',
      amount: 50,
    })

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(0)
  })

  it('should not be able to withdraw if the balance is insufficient', async () => {
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '102',
      amount: 50,
    })

    const response = await request(app.server).post('/event').send({
      type: 'withdraw',
      origin: '102',
      amount: 100,
    })

    expect(response.status).toEqual(409)
    expect(response.body).toEqual({
      message: 'Insufficient funds for withdrawal',
    })
  })

  it('should be able to transfer between two accounts', async () => {
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '103',
      amount: 200,
    })

    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '104',
      amount: 100,
    })

    const response = await request(app.server).post('/event').send({
      type: 'transfer',
      origin: '103',
      destination: '104',
      amount: 100,
    })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      origin: {
        id: '103',
        balance: 100,
      },
      destination: {
        id: '104',
        balance: 200,
      },
    })
  })

  it('should not be able to transfer if the origin account does not exist', async () => {
    const response = await request(app.server).post('/event').send({
      type: 'transfer',
      origin: 'non-existent-origin',
      destination: '104',
      amount: 50,
    })

    expect(response.status).toEqual(404)
    expect(response.body).toEqual(0)
  })

  it('should be able to transfer if the destination account does not exist', async () => {
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '105',
      amount: 100,
    })

    const response = await request(app.server).post('/event').send({
      type: 'transfer',
      origin: '105',
      destination: 'new-destination-id',
      amount: 50,
    })

    expect(response.status).toEqual(201)
    expect(response.body).toEqual({
      origin: {
        id: '105',
        balance: 50,
      },
      destination: {
        id: 'new-destination-id',
        balance: 50,
      },
    })
  })

  it('should not be able to transfer if the origin account balance is insufficient', async () => {
    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '106',
      amount: 50,
    })

    await request(app.server).post('/event').send({
      type: 'deposit',
      destination: '107',
      amount: 100,
    })

    const response = await request(app.server).post('/event').send({
      type: 'transfer',
      origin: '106',
      destination: '107',
      amount: 100,
    })

    expect(response.status).toEqual(409)
    expect(response.body).toEqual({
      message: 'Insufficient funds for transfer',
    })
  })
})
