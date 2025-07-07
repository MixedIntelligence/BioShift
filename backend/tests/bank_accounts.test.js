const request = require('supertest');
const app = require('../index');
const db = require('../models/db');
const BankAccount = require('../models/bank_account');
const jwt = require('jsonwebtoken');

jest.mock('../models/bank_account');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'your-default-secret', { expiresIn: '1h' });
};

describe('Bank Accounts API', () => {
  let user1Token;
  let user2Token;

  beforeAll(() => {
    user1Token = generateToken(1);
    user2Token = generateToken(2);
  });

  afterAll(() => {
    // No db.close() needed for pg pool
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/bank_accounts', () => {
    it('should allow a user to add a new bank account', async () => {
      const newAccountData = {
        accountHolderName: 'User One',
        accountNumber: '123456789',
        routingNumber: '987654321',
      };
      const createdAccount = { id: 1, userId: 1, ...newAccountData };

      BankAccount.createBankAccount.mockReturnValue(createdAccount);

      const res = await request(app)
        .post('/api/bank_accounts')
        .set('Authorization', `Bearer ${user1Token}`)
        .send(newAccountData);

      expect(res.statusCode).toEqual(201);
      expect(res.body).toEqual(createdAccount);
      expect(BankAccount.createBankAccount).toHaveBeenCalledWith(1, newAccountData.accountHolderName, newAccountData.accountNumber, newAccountData.routingNumber);
    });
  });

  describe('GET /api/bank_accounts', () => {
    it('should allow a user to retrieve their own bank accounts', async () => {
      const user1Accounts = [
        { id: 1, userId: 1, accountHolderName: 'User One', accountNumber: '111', routingNumber: '222' },
        { id: 2, userId: 1, accountHolderName: 'User One', accountNumber: '333', routingNumber: '444' },
      ];

      BankAccount.getBankAccountsByUserId.mockReturnValue(user1Accounts);

      const res = await request(app)
        .get('/api/bank_accounts')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual(user1Accounts);
      expect(BankAccount.getBankAccountsByUserId).toHaveBeenCalledWith(1);
    });

    it('should not retrieve accounts for another user', async () => {
        BankAccount.getBankAccountsByUserId.mockImplementation((userId) => {
            if (userId === 1) {
              return [{ id: 1, userId: 1, accountHolderName: 'User One' }];
            }
            return [];
          });
  
        const res = await request(app)
          .get('/api/bank_accounts')
          .set('Authorization', `Bearer ${user2Token}`);
  
        expect(res.statusCode).toEqual(200);
        expect(res.body).toEqual([]);
        expect(BankAccount.getBankAccountsByUserId).toHaveBeenCalledWith(2);
    });
  });

  describe('DELETE /api/bank_accounts/:id', () => {
    it('should allow a user to delete their own bank account', async () => {
      const user1Accounts = [{ id: 1, userId: 1, accountHolderName: 'User One' }];
      BankAccount.getBankAccountsByUserId.mockReturnValue(user1Accounts);
      BankAccount.deleteBankAccount.mockReturnValue(true);

      const res = await request(app)
        .delete('/api/bank_accounts/1')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toEqual(200);
      expect(res.body).toEqual({ message: 'Bank account deleted successfully.' });
      expect(BankAccount.deleteBankAccount).toHaveBeenCalledWith('1');
    });

    it('should not allow a user to delete a bank account belonging to another user', async () => {
      const user2Accounts = [{ id: 2, userId: 2, accountHolderName: 'User Two' }];
      BankAccount.getBankAccountsByUserId.mockImplementation((userId) => {
        if (userId === 1) return [];
        if (userId === 2) return user2Accounts;
        return [];
      });

      const res = await request(app)
        .delete('/api/bank_accounts/2')
        .set('Authorization', `Bearer ${user1Token}`);

      expect(res.statusCode).toEqual(404);
      expect(res.body).toEqual({ error: 'Bank account not found or you do not have permission to delete it.' });
      expect(BankAccount.deleteBankAccount).not.toHaveBeenCalled();
    });
  });
});