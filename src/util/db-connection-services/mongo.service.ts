import { DatabaseService } from '../../interfaces/db-service.interface';
import mongoose from 'mongoose';
import { ApplicationConfig } from '../../interfaces/application-config.interface';
import { LogStatementHelper, LogStatementDocument, LogStatementInterface } from '../../models/log-statement.model';

export class MongoService implements DatabaseService {

  applicationModels = new Map<string, mongoose.Model<LogStatementDocument>>();

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
      applications.forEach((app) => this.applicationModels.set(app.clientId, LogStatementHelper.createLogStatementDocument(app.name.toLowerCase())));
    } catch (e) {
      console.error('Error setting up applications', e);
    }
  }

  create(obj: LogStatementInterface, clientId: string): Promise<any> {
    try {
      const model = this.applicationModels.get(clientId);

      if (!model) {
        throw new Error('Unknown Client ID');
      }

      return model.create(obj);
    } catch (e) {
      console.log(`Error writing log statement to client ID ${clientId}`, e);
    }
  }

  validateClientId(clientIdToTest: string): boolean {
    return !!this.applicationModels.get(clientIdToTest && clientIdToTest.toLowerCase());
  }

}
