import { databaseTypes } from '../../interfaces/database-config.interface';
import fs from 'fs';
import { DatabaseService } from '../../interfaces/db-service.interface';
import { SidelogConfig } from '../../interfaces/sidelog-config.interface';
import { environment } from '../environment';

export class DatabaseConfigService {

  private config: SidelogConfig;
  databaseService: DatabaseService;

  connect(): Promise<any> {
    this.readConfigFromDisk();
    this.validateConfig();
    this.databaseService = databaseTypes.get(this.config.database.type);
    this.databaseService.setupApplications(this.config.applications);
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
      process.exit(9);
    }
  }

  private validateConfig() {
    try {
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
          throw new Error(`No name passed into application at index ${index}`);
        }

        if (!app.clientId) {
          throw new Error(`No clientId passed into application at index ${index}`);
        }
      });
    } catch (e) {
      console.error(e.message);
      process.exit(9);
    }
  }
}
