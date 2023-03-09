import { DatabaseService } from '../../interfaces/db-service.interface';
import { connect, pluralize, Model, connection, Connection } from 'mongoose';
import { ApplicationConfig, Application } from '../../interfaces/application-config.interface';
import { LogStatementHelper, LogStatementDocument, LogStatementInterface } from '../../models/log-statement.model';
import { BaseDatabaseService } from './base-database.service';
import { IncomingHttpHeaders } from 'http';

export class MongoService extends BaseDatabaseService implements DatabaseService {

  applications!: Map<string, MongoApplication>;

  connect(connectionString: string): Promise<any> {
    return connect(connectionString);
  }

  setupApplications(applications: ApplicationConfig[]): void {
    try {
      pluralize(null);
      applications.forEach((app) =>
        super.onboardApplication(app, LogStatementHelper.createLogStatementDocument(app.name.toLowerCase())));
    } catch (e) {
      console.error('Error setting up applications', e);
    }
  }

  create(obj: LogStatementInterface, headers: IncomingHttpHeaders): Promise<any> {
    try {
      const model = this.applications.get(<string>headers.clientid)?.dbAccessor;

      if (!model) {
        throw new Error('Unknown Client ID');
      }

      return model.create(obj);
    } catch (e) {
      console.error(`Error writing log statement to client ID ${headers.clientid}`, e);
      throw e;
    }
  }

  get connection(): Connection {
    return connection;
  }

  async isConnected(): Promise<boolean> {
    return this.connection.readyState === 1;
  }

}

interface MongoApplication extends Application {
  dbAccessor: Model<LogStatementDocument>
}
