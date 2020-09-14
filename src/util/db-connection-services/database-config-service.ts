import { DatabaseConfig, databaseTypes, databaseConnectionTypeEnum } from '../../interfaces/database-config.interface';
import fs from 'fs';
import { DatabaseConnectionService } from '../../interfaces/db-connect.interface';

export class DatabaseConfigService {

  private config: DatabaseConfig;
  private connectionService: DatabaseConnectionService;

  connect(): Promise<any> {
    this.readDatabaseConfig();
    this.connectionService = databaseTypes.get(this.config.type);
    return this.connectionService.connect(this.config.connectionString);
  }

  get databaseType(): databaseConnectionTypeEnum {
    return this.config?.type;
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