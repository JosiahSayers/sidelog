import { databaseTypes } from '../../interfaces/database-config.interface';
import fs from 'fs';
import { DatabaseService } from '../../interfaces/db-service.interface';
import { SidelogConfig } from '../../interfaces/sidelog-config.interface';
import { environment } from '../environment';
import { sidelogAppConfig } from './sidelog-application-config';
import { AutoLogHeaderEnum } from '../../interfaces/application-config.interface';
import { ErrorLogger } from '../error-logging-service/error-logger.service';

export class DatabaseConfigService {

  config: SidelogConfig;
  databaseService: DatabaseService;
  logger: ErrorLogger;

  getConfig(): void {
    this.readConfigFromDisk();
    this.validateConfig();
  }

  connect(): Promise<any> {
    this.databaseService = databaseTypes.get(this.config.database.type);
    this.databaseService.setupApplications([...this.config.applications, sidelogAppConfig]);
    return this.databaseService.connect(this.config.database.connectionString);
  }

  private readConfigFromDisk(): void {
    try {

      if (!environment.CONFIG_PATH) {
        throw new Error('CONFIG_PATH environment variable was not provided');
      }

      const configString = fs.readFileSync(environment.CONFIG_PATH, { encoding: 'utf-8' });
      this.config = JSON.parse(configString);
    } catch (e) {
      console.error('Error reading config file from disk', e.message);
      throw e;
    }
  }

  private validateConfig() {
    if (!this.config.database) {
      throw new Error('Database config not found');
    }

    if (!this.config.database.connectionString) {
      throw new Error('Database connection string missing');
    }

    if (!databaseTypes.get(this.config.database.type)) {
      throw new Error(`Invalid database type: ${this.config.database.type}`);
    }

    if (!this.config.applications || this.config.applications.length === 0) {
      throw new Error('No applications found in config file');
    }

    this.config.applications.forEach((app, index) => {
      if (!app.name) {
        throw new Error(`No name set on application at index ${index}`);
      }

      if (!app.clientId) {
        throw new Error(`No clientId set on application at index ${index}`);
      }

      if (app.autoLogHeaders) {
        const headersToRemove: string[] = [];

        app.autoLogHeaders.forEach((header) => {
          if (!Object.values(AutoLogHeaderEnum).includes(header)) {
            console.warn(`WARNING: ${header} is not a valid auto log option and will be ignored.`);
            headersToRemove.push(header);
          }
        });

        headersToRemove.forEach((header) => {
          const index = app.autoLogHeaders.findIndex(<any>header);
          app.autoLogHeaders.splice(index, 1);
        });
      }
    });

  }
}
