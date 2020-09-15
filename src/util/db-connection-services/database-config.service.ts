import { DatabaseConfig, databaseTypes, databaseConnectionTypeEnum } from '../../interfaces/database-config.interface';
import fs from 'fs';
import { DatabaseService } from '../../interfaces/db-service.interface';

export class DatabaseConfigService {

  private config: DatabaseConfig;
  private connectionService: DatabaseService;

  connect(): Promise<any> {
    this.readDatabaseConfig();
    this.connectionService = databaseTypes.get(this.config.type);
    return this.connectionService.connect(this.config.connectionString);
  }

  private readDatabaseConfig(): void {
    try {
      const configString = fs.readFileSync('./config/db.config.json', { encoding: 'utf-8' });
      this.config = JSON.parse(configString);
    } catch (e) {
      console.error('Error reading database config file', e);
    }
  }
}
