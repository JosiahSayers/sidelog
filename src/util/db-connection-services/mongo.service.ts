import { DatabaseService } from '../../interfaces/db-service.interface';
import mongoose from 'mongoose';
import { ApplicationConfig, Application } from '../../interfaces/application-config.interface';
import { LogStatementHelper, LogStatementDocument, LogStatementInterface } from '../../models/log-statement.model';
import { BaseDatabaseService } from './base-database.service';

export class MongoService extends BaseDatabaseService implements DatabaseService {

  applications: Map<string, MongoApplication>;

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
      console.log(this.applications);
    } catch (e) {
      console.error('Error setting up applications', e);
    }
  }

  create(obj: LogStatementInterface, clientId: string): Promise<any> {
    try {
      const model = this.applications.get(clientId)?.dbAccessor;

      if (!model) {
        throw new Error('Unknown Client ID');
      }

      return model.create(obj);
    } catch (e) {
      console.log(`Error writing log statement to client ID ${clientId}`, e);
    }
  }

}

interface MongoApplication extends Application {
  dbAccessor: mongoose.Model<LogStatementDocument>
}
