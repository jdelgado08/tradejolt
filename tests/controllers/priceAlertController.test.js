const { createPriceAlert, getPriceAlerts, deletePriceAlert, updatePriceAlert, restorePriceAlerts } = require('../../controllers/priceAlertController');
const PriceAlert = require('../../models/PriceAlert');
const { syncWebSocketSubscriptions } = require('../../utils/apcaWsClient');

jest.mock('../../models/PriceAlert');
jest.mock('../../utils/apcaWsClient', () => ({
  syncWebSocketSubscriptions: jest.fn()
}));

describe('PriceAlertController - Unit Tests', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createPriceAlert', () => {
    it('should validate required fields', async () => {
      const req = {
        body: { 
          symbol: 'AAPL',
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

    it('should return an error for invalid priceLevel or condition', async () => {
        const req = {
          body: {
            symbol: 'AAPL',
            priceLevel: 'invalid_price',  
            condition: 'invalid_condition', 
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
        expect(res.json).toHaveBeenCalledWith({ msg: 'Invalid priceLevel or condition' });
     });

     it('should return an error if user is not authorized to create the price alert', async () => {
        const req = {
          body: {
            symbol: 'AAPL',
            priceLevel: 150,
            condition: 'above',
            userEmail: 'test@test.com',
          },
          user: null,
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
     
        await createPriceAlert(req, res);
     
        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Not authorized to create this alert' });
     });

     it('should return an error if symbol or userEmail is empty', async () => {
        const req = {
          body: {
            symbol: '',  
            priceLevel: 150,
            condition: 'above',
            userEmail: '',
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
     });

     it('should call syncWebSocketSubscriptions after creating a price alert', async () => {
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
     
        const mockAlert = { ...req.body, isActive: true, hasTriggered: false };
        PriceAlert.create.mockResolvedValue(mockAlert);
        syncWebSocketSubscriptions.mockResolvedValue();
     
        await createPriceAlert(req, res);
     
        expect(syncWebSocketSubscriptions).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockAlert);
     }); 
     it('should return an error if priceLevel is undefined', async () => {
        const req = {
          body: {
            symbol: 'AAPL',
            condition: 'above',
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
      });
  });
  describe('getPriceAlerts', () => {
    it('should get all price alerts for the user', async () => {
      const req = {
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      const mockAlerts = [{ symbol: 'AAPL', priceLevel: 150 }];
      PriceAlert.find.mockResolvedValue(mockAlerts);

      await getPriceAlerts(req, res);

      expect(PriceAlert.find).toHaveBeenCalledWith({ userId: '123' });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockAlerts);
    });

    it('should return an empty array if no alerts are found', async () => {
      const req = {
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };

      PriceAlert.find.mockResolvedValue([]);

      await getPriceAlerts(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([]);
    });
  });
  describe('deletePriceAlert', () => {
    it('should delete a price alert by ID', async () => {
      const req = {
        params: { id: '123' },
        user: { userId: '123' },
      };
      const res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
    
      const mockAlert = { symbol: 'AAPL', userEmail: 'test@test.com' };
      PriceAlert.findOne.mockResolvedValue(mockAlert);
      PriceAlert.deleteOne.mockResolvedValue({});
    
      await deletePriceAlert(req, res);
    
      expect(PriceAlert.deleteOne).toHaveBeenCalledWith({ _id: '123', userId: '123' });
      expect(syncWebSocketSubscriptions).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ msg: 'Price alert deleted successfully' });
    });

    it('should return error if price alert does not exist', async () => {
        const req = {
          params: { id: 'non-existing-id' },
          user: { userId: '123' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        PriceAlert.findOne.mockResolvedValue(null); 
      
        await deletePriceAlert(req, res);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Alert not found or unauthorized' });
      });
      it('should delete a price alert successfully and check if syncWebSocketSubscriptions is called', async () => {
        const req = {
          params: { id: '123' },
          user: { userId: '123' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        const mockAlert = { symbol: 'AAPL', userEmail: 'test@test.com' };
        PriceAlert.findOne.mockResolvedValue(mockAlert);
        PriceAlert.deleteOne.mockResolvedValue({});
       
        await deletePriceAlert(req, res);
      
        expect(PriceAlert.deleteOne).toHaveBeenCalledWith({ _id: '123', userId: '123' });
        expect(syncWebSocketSubscriptions).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Price alert deleted successfully' });
      });
      
  });
  describe('restorePriceAlerts', () => {
    it('should restore all active price alerts', async () => {
        const req = {};
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        syncWebSocketSubscriptions.mockResolvedValue();
      
        await restorePriceAlerts(req, res);
      
        expect(syncWebSocketSubscriptions).toHaveBeenCalledTimes(1);
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Alerts restored successfully.' });
    });
});
describe('updatePriceAlert', () => {
    it('should update a price alert', async () => {
        const req = {
            params: { id: '123' },
            body: { priceLevel: 160 },
            user: { userId: '123' },
        };
        const res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        
        const mockAlert = { 
            symbol: 'AAPL', 
            priceLevel: 150, 
            condition: 'above', 
            userEmail: 'test@test.com',
            isActive: true,
            save: jest.fn().mockResolvedValue({ 
                symbol: 'AAPL', 
                priceLevel: 160, 
                condition: 'above', 
                userEmail: 'test@test.com',
                isActive: true 
            })
        };
        
        PriceAlert.findById.mockResolvedValue(mockAlert);
        
        await updatePriceAlert(req, res);
        
        expect(PriceAlert.findById).toHaveBeenCalledWith('123');
        expect(mockAlert.save).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ priceLevel: 160 }));
    });
    it('should return an error if price alert does not exist', async () => {
        const req = {
          params: { id: 'non-existing-id' },
          body: { priceLevel: 160, condition: 'below' },
          user: { userId: '123' },
        };
        const res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
      
        PriceAlert.findById.mockResolvedValue(null);
      
        await updatePriceAlert(req, res);
      
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ msg: 'Price alert not found' });
    });
});
}); 