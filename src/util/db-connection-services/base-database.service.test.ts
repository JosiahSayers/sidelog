import { Application, AutoLogHeaderEnum } from '../../interfaces/application-config.interface';
import { BaseDatabaseService } from './base-database.service';

describe('BaseDatabaseService', () => {
  let service: BaseDatabaseService;

  beforeEach(() => service = new BaseDatabaseService());

  describe('onBoardApplication', () => {
    it('uses the passed in arguments to create a new Application and set it to the applications map', () => {
      service.onboardApplication({
        name: 'NAME',
        clientId: 'CLIENT_ID',
        approvedOrigins: ['ORIGIN']
      },
        'DATABASE_ACCESSOR'
      );

      expect(service.applications.size).toBe(1);
      expect(service.applications.get('CLIENT_ID')).toEqual(mockApplication());
    });
  });

  describe('isValidClientId', () => {
    it('returns true when there is an application with the passed in client id', () => {
      service.applications.set('CLIENT_ID', mockApplication());
      expect(service.isValidClientId('CLIENT_ID')).toBe(true);
    });

    it('returns false when there is not an application with the passed in client id', () => {
      service.applications.set('CLIENT_ID', mockApplication());
      expect(service.isValidClientId('OTHER_CLIENT_ID')).toBe(false);
    });
  });

  describe('isValidOrigin', () => {
    it('returns false when the client id is invalid', () => {
      service.applications.set('CLIENT_ID', mockApplication());
      expect(service.isValidOrigin('ORIGIN', 'OTHER_CLIENT_ID')).toBe(false);
    });

    it('returns false when the client id is valid but the origin is invalid for that application', () => {
      service.applications.set('CLIENT_ID', mockApplication());
      expect(service.isValidOrigin('OTHER_ORIGIN', 'CLIENT_ID')).toBe(false);
    });

    it('returns true when the client id is valid and the origin is valid for that application', () => {
      service.applications.set('CLIENT_ID', mockApplication());
      expect(service.isValidOrigin('ORIGIN', 'CLIENT_ID')).toBe(true);
    });

    it('returns true when the client id is valid and the application has an empty approvedOrigins array', () => {
      service.applications.set('CLIENT_ID', {
        ...mockApplication(),
        approvedOrigins: []
      });
      expect(service.isValidOrigin('ANY_ORIGIN', 'CLIENT_ID')).toBe(true);
    });
  });

  describe('getAutoLogObjectForApp', () => {
    beforeEach(() => service.applications.set('CLIENT_ID', {
      ...mockApplication(),
      autoLogHeaders: [
        AutoLogHeaderEnum.REFERER,
        AutoLogHeaderEnum.USER_AGENT
      ]
    }));

    it('returns an empty object when the application cannot be found by the clientid', () => {
      expect(service.getAutoLogObjectForApp({ clientid: 'OTHER_CLIENT_ID' })).toEqual({});
    });

    it('returns an empty object when the application is found but the autoLogHeaders array is empty', () => {
      service.applications.set('NEW_CLIENT_ID', mockApplication());
      expect(service.getAutoLogObjectForApp({ clientid: 'NEW_CLIENT_ID' })).toEqual({});
    });

    fit('builds and returns the expected object otherwise', () => {
      expect(service.getAutoLogObjectForApp({
        clientid: 'CLIENT_ID',
        referer: 'REFERER',
        'user-agent': 'USER_AGENT'
      })).toEqual({
        referer: 'REFERER',
        'user-agent': 'USER_AGENT'
      });
    });
  });
});

function mockApplication(): Application {
  return {
    name: 'NAME',
    clientId: 'CLIENT_ID',
    approvedOrigins: ['ORIGIN'],
    autoLogHeaders: [],
    dbAccessor: 'DATABASE_ACCESSOR'
  };
}
