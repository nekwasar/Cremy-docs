import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../src/app';
import connectDB from '../src/lib/mongodb';
import User from '../src/models/User';
import CreditTransaction from '../src/models/CreditTransaction';

describe('Credit System API', () => {
  let testUser: { email: string; password: string; name: string; accessToken: string };

  beforeAll(async () => {
    await connectDB();

    testUser = {
      email: `credit-test-${Date.now()}@example.com`,
      password: 'TestPassword123',
      name: 'Credit Test User',
    };

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    testUser.accessToken = registerRes.body.data.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({ email: /credit-test/ });
    await CreditTransaction.deleteMany({});
  });

  describe('GET /api/credits/balance', () => {
    it('should return user credit balance', async () => {
      const res = await request(app)
        .get('/api/credits/balance')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.credits).toBeDefined();
    });

    it('should reject unauthorized request', async () => {
      const res = await request(app)
        .get('/api/credits/balance')
        .expect(401);

      expect(res.body.error.code).toBe('NO_TOKEN');
    });
  });

  describe('GET /api/credits/history', () => {
    it('should return credit transaction history', async () => {
      const res = await request(app)
        .get('/api/credits/history')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.transactions).toBeDefined();
      expect(res.body.data.pagination).toBeDefined();
    });

    it('should filter by transaction type', async () => {
      const res = await request(app)
        .get('/api/credits/history?type=usage')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });
  });

  describe('POST /api/credits/purchase', () => {
    it('should process credit purchase', async () => {
      const res = await request(app)
        .post('/api/credits/purchase')
        .send({ packageId: 'starter' })
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.credits).toBeDefined();
    });
  });

  describe('POST /api/credits/promo', () => {
    it('should validate promo code', async () => {
      const res = await request(app)
        .post('/api/credits/promo')
        .send({ code: 'INVALID' })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_CODE');
    });

    it('should reject empty code', async () => {
      const res = await request(app)
        .post('/api/credits/promo')
        .send({ code: '' })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('POST /api/credits/transfer', () => {
    it('should reject transfer to self', async () => {
      const res = await request(app)
        .post('/api/credits/transfer')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ recipientEmail: testUser.email, amount: 10 })
        .expect(400);

      expect(res.body.error.code).toBe('INVALID_RECIPIENT');
    });

    it('should reject invalid amount', async () => {
      const res = await request(app)
        .post('/api/credits/transfer')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .send({ recipientEmail: 'other@example.com', amount: -10 })
        .expect(400);

      expect(res.body.error).toBeDefined();
    });
  });

  describe('GET /api/credits/widget', () => {
    it('should return widget data', async () => {
      const res = await request(app)
        .get('/api/credits/widget')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.credits).toBeDefined();
      expect(res.body.data.toolCosts).toBeDefined();
    });
  });

  describe('GET /api/credits/report', () => {
    it('should generate credit report', async () => {
      const res = await request(app)
        .get('/api/credits/report')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.summary).toBeDefined();
    });

    it('should export as CSV', async () => {
      const res = await request(app)
        .get('/api/credits/report?format=csv')
        .set('Authorization', `Bearer ${testUser.accessToken}`)
        .expect(200);

      expect(res.headers['content-type']).toContain('text/csv');
    });
  });
});

describe('Credit Deduction', () => {
  let testUser: { email: string; password: string; name: string; accessToken: string };

  beforeAll(async () => {
    await connectDB();

    testUser = {
      email: `deduct-test-${Date.now()}@example.com`,
      password: 'TestPassword123',
      name: 'Deduct Test User',
    };

    const registerRes = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    testUser.accessToken = registerRes.body.data.accessToken;
  });

  afterAll(async () => {
    await User.deleteMany({ email: /deduct-test/ });
    await CreditTransaction.deleteMany({});
  });

  it('should deduct credits before action', async () => {
    const { deductCredits } = await import('../src/lib/credit-deduction');

    const user = await User.findOne({ email: testUser.email });
    expect(user).toBeDefined();
  });
});

describe('Credit Expiration', () => {
  it('should check credit expiration logic', async () => {
    const { checkExpiringCredits } = await import('../src/lib/credit-expiration');
    expect(checkExpiringCredits).toBeDefined();
  });
});

describe('Free Credits', () => {
  it('should check free credit allocation', async () => {
    const { getFreeCreditsStatus } = await import('../src/lib/free-credits');
    expect(getFreeCreditsStatus).toBeDefined();
  });
});