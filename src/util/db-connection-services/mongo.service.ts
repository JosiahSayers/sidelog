import { DatabaseService } from '../../interfaces/db-service.interface';
import mongoose from 'mongoose';
import { ApplicationConfig, Application } from '../../interfaces/application-config.interface';
import { LogStatementHelper, LogStatementDocument, LogStatementInterface } from '../../models/log-statement.model';

export class MongoService implements DatabaseService {

  applicationModels = new Map<string, MongoApplication>();

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
      applications.forEach((app) => this.applicationModels.set(app.clientId, {
        name: app.name,
        clientId: app.clientId,
        approvedOrigins: app.approvedOrigins || [],
        dbAccessor: LogStatementHelper.createLogStatementDocument(app.name.toLowerCase())
      }));
      console.log(this.applicationModels);
    } catch (e) {
      console.error('Error setting up applications', e);
    }
  }

  create(obj: LogStatementInterface, clientId: string): Promise<any> {
    try {
      const model = this.applicationModels.get(clientId)?.dbAccessor;

      if (!model) {
        throw new Error('Unknown Client ID');
      }

      return model.create(obj);
    } catch (e) {
      console.log(`Error writing log statement to client ID ${clientId}`, e);
    }
  }

  isValidClientId(clientIdToTest: string): boolean {
    return !!this.applicationModels.get(clientIdToTest);
  }

  isValidOrigin(originToTest: string, clientId: string): boolean {
    const app = this.applicationModels.get(clientId);
    return app?.approvedOrigins.length === 0 || app?.approvedOrigins.includes(originToTest);
  }

}

interface MongoApplication extends Application {
  dbAccessor: mongoose.Model<LogStatementDocument>
}
