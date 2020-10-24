import fs from 'fs';
jest.mock('fs');
import { environment } from '../../util/environment';
import { DatabaseConfigService } from './database-config.service';
import { mocked } from 'ts-jest/utils';
import { databaseTypes } from '../../interfaces/database-config.interface';
import { sidelogAppConfig } from './sidelog-application-config';
import { AutoLogHeaderEnum } from '../../interfaces/application-config.interface';

describe('DatabaseConfigService', () => {
  const service = new DatabaseConfigService();
  const mockedFs = mocked(fs);
  const validConfig = {
    database: {
      connectionString: 'CONNECTION STRING',
      type: 'mongo'
    },
    applications: [
      {
        name: 'TEST',
        clientId: 'CLIENT ID 1'
      }
    ]
  };

  beforeEach(() => {
    mockedFs.readFileSync.mockReturnValue('{}');
    console.error = jest.fn();
  });

  it('instantiates', () => expect(service).toBeDefined());

  describe('getConfig', () => {
    it('throws the correct error when a CONFIG_* variable is not provided', () => {
      environment.CONFIG_PATH = '';
      expect(() => service.getConfig()).toThrowError('CONFIG_JSON or CONFIG_PATH environment variable was not provided, one is required');
    });

    describe('when a CONFIG_JSON variable is provided', () => {
      beforeEach(() => {
        environment.CONFIG_PATH = null;
        environment.CONFIG_JSON = JSON.stringify(validConfig);
      });

      it('sets config to the parsed value of the CONFIG_JSON variable', () => {
        service.getConfig();
        expect(service.config).toEqual(validConfig);
      });

      it('throws an error when the value of CONFIG_JSON is not valid JSON', () => {
        environment.CONFIG_JSON = 'invalid JSON';
        expect(() => service.getConfig()).toThrow();
      });
    });

    describe('when a CONFIG_PATH variable is provided', () => {
      beforeEach(() => mockConfigFile(validConfig));

      it('uses CONFIG_PATH to read from the filesystem', () => {
        service.getConfig();
        expect(mockedFs.readFileSync).toHaveBeenCalledWith('CONFIG_PATH', { encoding: 'utf-8' });
        expect(service.config).toEqual(validConfig);
      });

      it('throws an error when it can\'t parse the file from disk', () => {
        mockConfigFile('invalid JSON');
        expect(() => service.getConfig()).toThrow();
      });
    });

    describe('config file errors', () => {
      it('when the database object is missing', () => {
        expect(() => service.getConfig()).toThrowError('Database config not found');
      });

      it('when the connection string is missing', () => {
        mockConfigFile({ database: { type: 'DB_TYPE' } });
        expect(() => service.getConfig()).toThrowError('Database connection string missing');
      });

      it('when the database type is missing', () => {
        mockConfigFile({ database: { connectionString: 'CONNECTION STRING' } });
        expect(() => service.getConfig()).toThrowError('Invalid database type: undefined');
      });

      it('when the database type is not supported', () => {
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'UNSUPPORTED DB'
          }
        });
        expect(() => service.getConfig()).toThrowError('Invalid database type: UNSUPPORTED DB');
      });

      it('when the applications array is missing', () => {
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'mongo'
          }
        });
        expect(() => service.getConfig()).toThrowError('No applications found in config file');
      });

      it('when the applications array is empty', () => {
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'mongo'
          },
          applications: []
        });
        expect(() => service.getConfig()).toThrowError('No applications found in config file');
      });

      it('when any application has no name', () => {
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'mongo'
          },
          applications: [
            {
              name: 'NAME 1',
              clientId: 'CLIENT ID 1'
            },
            {
              name: '',
              clientId: 'CLIENT ID 2'
            }
          ]
        });
        expect(() => service.getConfig()).toThrowError('No name set on application at index 1');
      });

      it('when any application has no clientId', () => {
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'mongo'
          },
          applications: [
            {
              name: 'NAME 1'
            },
            {
              name: 'NAME 2',
              clientId: 'CLIENT ID 2'
            }
          ]
        });
        expect(() => service.getConfig()).toThrowError('No clientId set on application at index 0');
      });
    });

    describe('autoLogHeaders', () => {
      it('warns to the console and removes the invalid header when any application has an invalid autoLogHeader', () => {
        console.warn = jest.fn();
        mockConfigFile({
          database: {
            connectionString: 'CONNECTION STRING',
            type: 'mongo'
          },
          applications: [
            {
              name: 'NAME 1',
              clientId: 'CLIENT ID 1',
              autoLogHeaders: [
                AutoLogHeaderEnum.CONTENT_TYPE,
                <any>'INVALID'
              ]
            }
          ]
        });
        service.getConfig();
        expect(console.warn).toHaveBeenCalledWith('WARNING: INVALID is not a valid auto log option and will be ignored.');
        expect(service.config.applications[0].autoLogHeaders).toEqual([AutoLogHeaderEnum.CONTENT_TYPE]);
      });
    });
  });

  describe('connect', () => {
    const mockedDB = {
      setupApplications: jest.fn(),
      connect: jest.fn().mockReturnValue('CONNECT RETURN')
    };
    const testConfig = validConfig;

    beforeEach(() => {
      databaseTypes.set(<any>'TEST', <any>mockedDB);
      testConfig.database.type = <any>'TEST';
      service.config = <any>testConfig;
    });

    it('gets a database service from the databaseTypes map', () => {
      service.connect();
      expect(service.databaseService).toBe(mockedDB);
    });

    it('passes the config applications plus the sidelog app config to setupApplications', () => {
      service.connect();
      expect(mockedDB.setupApplications).toHaveBeenCalledWith([
        ...testConfig.applications,
        sidelogAppConfig
      ]);
    });

    it('returns the value of the connect method', () => {
      const returnValue = service.connect();
      expect(returnValue).toBe('CONNECT RETURN');
    });
  });

  function mockConfigFile(obj: string | { [key: string]: any }): void {
    environment.CONFIG_PATH = 'CONFIG_PATH';
    environment.CONFIG_JSON = null;
    obj = typeof obj === 'string' ? obj : JSON.stringify(obj);
    mockedFs.readFileSync.mockReturnValue(obj);
  }
});
