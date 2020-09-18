import { Request } from 'express';
import { LogsHelperService } from './logs-helper.service';
import { buildError } from '../util/error-builder';
import { ValidLogLevels } from '../models/log-statement.model';
import { DatabaseService } from '../interfaces/db-service.interface';
import { ErrorLogger } from '../util/error-logging-service/error-logger.service';

describe('LogsHelperService', () => {
  console.error = jest.fn();
  describe('createLog', () => {
    describe('throws an error when', () => {
      it('does not get a client id', async () => {
        const req = createMockRequest('', '', {});
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }
        expect(error).toEqual(buildError({
          message: 'Missing Client ID',
          developerMessage: 'Send a valid Client ID in the "clientId" header',
          responseCode: 400
        }));
      });

      it('gets an invalid client id', async () => {
        const req = createMockRequest('INVALID', '', {});
        req.db.isValidClientId.mockReturnValue(false);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Invalid Client ID',
          developerMessage: 'The passed in Client ID has not been setup. ID passed: INVALID',
          responseCode: 400
        }));
      });

      it('gets an origin that is invalid', async () => {
        const req = createMockRequest('CLIENT_ID', 'INVALID', {});
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(false);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Unapproved origin',
          developerMessage: 'The origin INVALID has not been approved for use with client ID CLIENT_ID',
          responseCode: 400
        }));
      });

      it('does not get a log object', async () => {
        const req = createMockRequest('CLIENT ID', '', null);
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Missing log object',
          developerMessage: 'Send a valid body with the request',
          responseCode: 400
        }));
      });

      it('does not get a log object message', async () => {
        const req = createMockRequest('CLIENT ID', '', { level: 'info' });
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Missing log message',
          developerMessage: 'Send a valid message field on the body',
          responseCode: 400
        }));
      });

      it('does not get a log object level', async () => {
        const req = createMockRequest('CLIENT ID', '', { message: 'MESSAGE' });
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Missing log level',
          developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
          responseCode: 400
        }));
      });

      it('gets an invalid log level', async () => {
        const req = createMockRequest('CLIENT ID', '', { message: 'MESSAGE', level: 'INVALID' });
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Invalid log level',
          developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
          responseCode: 400
        }));
      });

      it('any other exception is caught', async () => {
        const req = createMockRequest('CLIENT ID', '', { message: 'MESSAGE', level: 'info' });
        const testError = new Error('TEST');
        req.db.isValidClientId.mockReturnValue(true);
        req.db.isValidOrigin.mockReturnValue(true);
        req.db.create.mockImplementation(() => { throw testError; });
        let error;
        try {
          await LogsHelperService.createLog(<any>req);
        } catch (e) {
          error = e;
        }

        expect(req.logger.log).toHaveBeenCalledWith('TEST', { callStack: testError.stack });
        expect(error).toEqual(buildError({
          message: 'Unknown error occured',
          developerMessage: 'Please check the app logs and report anything that looks fishy on GitHub, thanks!',
          responseCode: 500
        }));
      });
    });
  });
});

const createMockRequest = (clientId: string, origin: string, body: Record<string, unknown>): MockRequest => <any>({
  headers: {
    clientid: clientId,
    origin
  },
  body,
  db: {
    create: jest.fn(),
    isValidClientId: jest.fn(),
    isValidOrigin: jest.fn(),
    getAutoLogObjectForApp: jest.fn()
  },
  logger: {
    log: jest.fn()
  }
});

interface MockRequest extends Request {
  db: DatabaseService & {
    create: jest.Mock,
    isValidClientId: jest.Mock,
    isValidOrigin: jest.Mock,
    getAutoLogObjectForApp: jest.Mock
  },
  logger: ErrorLogger & {
    log: jest.Mock
  }
}
