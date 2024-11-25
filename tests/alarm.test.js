const { createPriceAlert } = require('../../controllers/priceAlertController');
const PriceAlert = require('../../models/PriceAlert');


jest.mock('../../models/PriceAlert');
jest.mock('../../utils/apcaWsClient');

describe('PriceAlertController - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPriceAlert', () => {
    it('should validate required fields', async () => {
      const req = {
        body: {
          symbol: 'AAPL',
          // Missing priceLevel and condition
          userEmail: 'test@test.com',
        },
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      await createPriceAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ msg: 'All fields are required' });
      
      expect(PriceAlert.create).not.toHaveBeenCalled();
    });

    it('should create alert with valid inputs', async () => {
      const req = {
        body: {
          symbol: 'AAPL',
          priceLevel: 150,
          condition: 'above',
          userEmail: 'test@test.com',
        },
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const expectedAlert = {
        userId: '123',
        symbol: 'AAPL',
        priceLevel: 150,
        condition: 'above',
        isActive: true,
        userEmail: 'test@test.com',
      };

      PriceAlert.create.mockResolvedValue(expectedAlert);

      await createPriceAlert(req, res);

      expect(PriceAlert.create).toHaveBeenCalledWith(expectedAlert);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(expectedAlert);
    });

    it('should handle database errors', async () => {
      const req = {
        body: {
          symbol: 'AAPL',
          priceLevel: 150,
          condition: 'above',
          userEmail: 'test@test.com',
        },
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      PriceAlert.create.mockRejectedValue(new Error('DB Error'));

      await createPriceAlert(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Failed to create price alert' });
    });
  });
}); 