import { DatabaseService } from './db-service.interface';
import { MongoService } from '../util/db-connection-services/mongo-connection.service';

export interface DatabaseConfig {
  type: databaseConnectionTypeEnum,
  connectionString: string
}

export type databaseConnectionTypeEnum = 'mongo';

export const databaseTypes = new Map<databaseConnectionTypeEnum, DatabaseService>()
  .set('mongo', new MongoService());
