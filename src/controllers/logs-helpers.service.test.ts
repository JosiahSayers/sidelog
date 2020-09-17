import { Request } from 'express';
import { LogsHelperService } from './logs-helper.service';
import { buildError } from '../util/error-builder';
import { ValidLogLevels } from '../models/log-statement.model';

describe('LogsHelperService', () => {
  console.error = jest.fn();
  describe('createLog', () => {
    describe('throws an error when', () => {
      it('does not get a client id', async () => {
        const req = createMockRequest('', {});
        let error;
        try {
          await LogsHelperService.createLog(req);
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
        const req = createMockRequest('INVALID', {});
        req.db.validateClientId.mockReturnValue(false);
        let error;
        try {
          await LogsHelperService.createLog(req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Invalid Client ID',
          developerMessage: 'The passed in Client ID has not been setup. ID passed: INVALID',
          responseCode: 400
        }));
      });

      it('does not get a log object', async () => {
        const req = createMockRequest('CLIENT ID', null);
        req.db.validateClientId.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(req);
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
        const req = createMockRequest('CLIENT ID', { level: 'info' });
        req.db.validateClientId.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(req);
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
        const req = createMockRequest('CLIENT ID', { message: 'MESSAGE' });
        req.db.validateClientId.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(req);
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
        const req = createMockRequest('CLIENT ID', { message: 'MESSAGE', level: 'INVALID' });
        req.db.validateClientId.mockReturnValue(true);
        let error;
        try {
          await LogsHelperService.createLog(req);
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
        const req = createMockRequest('CLIENT ID', { message: 'MESSAGE', level: 'info' });
        req.db.validateClientId.mockReturnValue(true);
        req.db.create.mockImplementation(() => { throw new Error(); });
        let error;
        try {
          await LogsHelperService.createLog(req);
        } catch (e) {
          error = e;
        }

        expect(error).toEqual(buildError({
          message: 'Unknown error occured',
          developerMessage: 'Please check the app logs and report anything that looks fishy on GitHub, thanks!',
          responseCode: 500
        }));
      });
    });
  });
});

const createMockRequest = (clientId: string, body: Record<string, unknown>): Request & { db: { create: jest.Mock, validateClientId: jest.Mock } } => <any>({
  headers: {
    clientid: clientId
  },
  body,
  db: {
    create: jest.fn(),
    validateClientId: jest.fn()
  }
});
