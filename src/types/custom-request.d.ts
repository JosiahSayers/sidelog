import { DatabaseService } from '../interfaces/db-service.interface';
import { ErrorLogger } from '../util/error-logging-service/error-logger.service';

declare global {
  namespace Express {
    export interface Request {
      db: DatabaseService,
      logger: ErrorLogger
    }
  }
}