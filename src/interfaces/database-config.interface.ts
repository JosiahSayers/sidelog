import { DatabaseConnectionService } from './db-connect.interface'
import { MongoConnectionService } from '../util/db-connection-services/MongoConnection.service'

export interface DatabaseConfig {
  type: databaseConnectionTypeEnum,
  connectionString: string
}

export type databaseConnectionTypeEnum = 'mongo';

export const databaseTypes = new Map<databaseConnectionTypeEnum, DatabaseConnectionService>()
  .set('mongo', new MongoConnectionService());
