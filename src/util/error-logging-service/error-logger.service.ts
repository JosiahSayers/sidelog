import { environment } from '../environment';
import { DatabaseService } from '../../interfaces/db-service.interface';
import { sidelogAppConfig } from '../db-connection-services/sidelog-application-config';

export class ErrorLogger {
  private logToDB: boolean;

  constructor(private db: DatabaseService) {
    this.logToDB = environment.LOG_SERVER_ERRORS;
  }

  log(message: string, json = {}): void {
    console.error(message, json);

    if (this.logToDB) {
      this.db.create(
        {
          message,
          json,
          level: 'error'
        },
        sidelogAppConfig.clientId
      );
    }
  }

}
