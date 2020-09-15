import { DatabaseService } from '../interfaces/db-service.interface';

declare global {
  namespace Express {
    export interface Request {
      db: DatabaseService
    }
  }
}