import { MongoService } from './mongo-connection.service';
import mongoose from 'mongoose';
import { mocked } from 'ts-jest/utils';
import { LogStatementHelper } from '../../models/log-statement.model';
jest.mock('mongoose');

describe('MongoService', () => {
  const mockedDB = mocked(mongoose);
  const service = new MongoService();
  LogStatementHelper.createLogStatementDocument = jest.fn().mockImplementation((name: string) => name);

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
          clientId: 'CLIENT ID 1'
        },
        {
          name: 'APP 2',
          clientId: 'CLIENT ID 2'
        }
      ]);
      expect(service.applicationModels.size).toBe(2);
      expect(service.applicationModels.get('CLIENT ID 1')).toBe('app 1');
      expect(service.applicationModels.get('CLIENT ID 2')).toBe('app 2');
    });
  });
});
