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
  });
});
