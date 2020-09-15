import { DatabaseConfig, databaseTypes } from '../../interfaces/database-config.interface';
import fs from 'fs';
import { DatabaseService } from '../../interfaces/db-service.interface';
import { ApplicationConfig } from '../../interfaces/application-config.interface';

export class DatabaseConfigService {

  private config: DatabaseConfig;
  private applicationConfigs: ApplicationConfig[];
  databaseService: DatabaseService;

  connect(): Promise<any> {
    this.readDatabaseConfig();
    this.databaseService = databaseTypes.get(this.config.type);
    this.readApplicationConfig();
    this.databaseService.setupApplications(this.applicationConfigs);
    return this.databaseService.connect(this.config.connectionString);
  }

  private readDatabaseConfig(): void {
    try {
      const configString = fs.readFileSync('./config/db.config.json', { encoding: 'utf-8' });
      this.config = JSON.parse(configString);
    } catch (e) {
      console.error('Error reading database config file', e);
      process.exit();
    }
  }

  private readApplicationConfig(): void {
    try {
      const configString = fs.readFileSync('./config/applications.config.json', { encoding: 'utf-8' });
      this.applicationConfigs = JSON.parse(configString)?.applications;
    } catch (e) {
      console.error('Error reading application config file', e);
      process.exit();
    }
  }
}
