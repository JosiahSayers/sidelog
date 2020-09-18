import { ErrorLogger } from './error-logger.service';
import { environment } from '../environment';
import { sidelogAppConfig } from '../db-connection-services/sidelog-application-config';

describe('ErrorLogger', () => {
  const testDb: any = { create: jest.fn() };
  beforeEach(() => {
    console.error = jest.fn();
    testDb.create.mockReset();
  });

  describe('log', () => {
    it('logs the function arguments to the console', () => {
      const service = new ErrorLogger(testDb);
      service.log('TEST', { test: 'TEST' });
      expect(console.error).toHaveBeenCalledWith('TEST', { test: 'TEST' });
    });

    it('logs to the database when the feature is turned on', () => {
      environment.LOG_SERVER_ERRORS = true;
      const service = new ErrorLogger(testDb);
      service.log('TEST');
      expect(testDb.create).toHaveBeenCalledWith({
        message: 'TEST',
        json: {},
        level: 'error'
      },
        sidelogAppConfig
      );
    });

    it('does not log to the database when the feature is turned off', () => {
      environment.LOG_SERVER_ERRORS = false;
      const service = new ErrorLogger(testDb);
      service.log('TEST');
      expect(testDb.create).not.toHaveBeenCalled();
    });
  });
});
