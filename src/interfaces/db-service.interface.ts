import { ApplicationConfig } from './application-config.interface';
import { LogStatementInterface } from '../models/log-statement.model';
import { IncomingHttpHeaders } from 'http';

export interface DatabaseService {
  connect: (connectionString: string) => Promise<any>;
  setupApplications: (applications: ApplicationConfig[]) => void;
  create: (obj: LogStatementInterface, headers: IncomingHttpHeaders) => Promise<any>;
  isValidClientId: (clientId: string) => boolean;
  isValidOrigin: (origin: string, clientId: string) => boolean;
  getAutoLogObjectForApp: (headers: IncomingHttpHeaders & { ip: string }) => Record<string, string>;
}
