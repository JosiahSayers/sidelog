import { ApplicationConfig } from './application-config.interface';
import { LogStatementInterface } from '../models/log-statement.model';

export interface DatabaseService {
  connect: (connectionString: string) => Promise<any>;
  setupApplications: (applications: ApplicationConfig[]) => void;
  create: (obj: LogStatementInterface, clientId: string) => Promise<any>;
  validateClientId: (clientId: string) => boolean;
}
