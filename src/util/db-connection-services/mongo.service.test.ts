import { MongoService } from './mongo.service';
import mongoose from 'mongoose';
import { mocked } from 'ts-jest/utils';
import { LogStatementHelper } from '../../models/log-statement.model';
import { AutoLogHeaderEnum } from '../../interfaces/application-config.interface';
jest.mock('mongoose');

describe('MongoService', () => {
  const mockedDB = mocked(mongoose);
  const service = new MongoService();
  LogStatementHelper.createLogStatementDocument = jest.fn().mockImplementation((name: string) => `${name} DB ACCESSOR`);

  describe('connect', () => {
    it('calls mongoose\'s connect method with the correct arguments', () => {
      service.connect('CONNECTION STRING');
      expect(mockedDB.connect).toHaveBeenCalledWith(
        'CONNECTION STRING',
        {
          useNewUrlParser: true,
          useCreateIndex: true,
          useUnifiedTopology: true,
          useFindAndModify: false
        }
      );
    });

    it('returns the value of mongoose.connect', () => {
      mockedDB.connect.mockReturnValue(<any>'CONNECT RETURN VALUE');
      expect(service.connect('')).toBe('CONNECT RETURN VALUE');
    });
  });

  describe('setupApplications', () => {
    it('turns off mongoose pluralization', () => {
      service.setupApplications([]);
      expect(mockedDB.pluralize).toHaveBeenCalledWith(null);
    });

    it('populates the map using the passed in array', () => {
      service.setupApplications([
        {
          name: 'APP 1',
          clientId: 'CLIENT ID 1',
          autoLogHeaders: [
            AutoLogHeaderEnum.ORIGIN
          ]
        },
        {
          name: 'APP 2',
          clientId: 'CLIENT ID 2',
          approvedOrigins: [
            'test.com',
            'example.com'
          ]
        }
      ]);
      expect(service.applications.size).toBe(2);
      expect(service.applications.get('CLIENT ID 1')).toEqual({
        name: 'APP 1',
        clientId: 'CLIENT ID 1',
        approvedOrigins: [],
        autoLogHeaders: [
          AutoLogHeaderEnum.ORIGIN
        ],
        dbAccessor: 'app 1 DB ACCESSOR'
      });
      expect(service.applications.get('CLIENT ID 2')).toEqual({
        name: 'APP 2',
        clientId: 'CLIENT ID 2',
        approvedOrigins: [
          'test.com',
          'example.com'
        ],
        autoLogHeaders: [],
        dbAccessor: 'app 2 DB ACCESSOR'
      });
    });

    it('logs an error to the console when there is an error setting up the applications', () => {
      console.error = jest.fn();
      mockedDB.pluralize.mockImplementation(() => { throw new Error('TEST_ERROR'); });
      service.setupApplications([]);
      expect(console.error).toHaveBeenCalledWith('Error setting up applications', new Error('TEST_ERROR'));
    });
  });

  describe('create', () => {
    it('logs to the console and throws an error when the clientid is invalid', () => {
      console.error = jest.fn();
      expect(() => service.create(<any>{}, {})).toThrowError(new Error('Unknown Client ID'));
      expect(console.error).toHaveBeenCalledWith('Error writing log statement to client ID undefined', new Error('Unknown Client ID'));
    });

    it('writes the expected object to the application db model', () => {
      const mockApp = { dbAccessor: { create: jest.fn().mockImplementation(() => 'WRITTEN TO DB RETURN VALUE') } };
      service.applications.set('CLIENT_ID', <any>mockApp);
      const returnValue = service.create(<any>{ testObject: 'TEST' }, { clientid: 'CLIENT_ID' });
      expect(returnValue).toBe('WRITTEN TO DB RETURN VALUE');
      expect(mockApp.dbAccessor.create).toHaveBeenCalledWith({ testObject: 'TEST' });
    });
  });
});
