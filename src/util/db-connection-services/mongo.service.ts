import { DatabaseService } from '../../interfaces/db-service.interface';
import mongoose from 'mongoose';
import { ApplicationConfig, Application } from '../../interfaces/application-config.interface';
import { LogStatementHelper, LogStatementDocument, LogStatementInterface } from '../../models/log-statement.model';
import { BaseDatabaseService } from './base-database.service';
import { IncomingHttpHeaders } from 'http';

export class MongoService extends BaseDatabaseService implements DatabaseService {

  applications!: Map<string, MongoApplication>;

  connect(connectionString: string): Promise<any> {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  }

  setupApplications(applications: ApplicationConfig[]): void {
    try {
      mongoose.pluralize(null);
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

}

interface MongoApplication extends Application {
  dbAccessor: mongoose.Model<LogStatementDocument>
}
