import { DatabaseConnectionService } from '../../interfaces/db-connect.interface';
import mongoose from 'mongoose';

export class MongoConnectionService implements DatabaseConnectionService {

  connect(connectionString: string): Promise<any> {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  }

}
