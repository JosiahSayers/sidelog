import { DatabaseService } from '../../interfaces/db-service.interface';
import mongoose from 'mongoose';

export class MongoService implements DatabaseService {

  connect(connectionString: string): Promise<any> {
    return mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useUnifiedTopology: true,
      useFindAndModify: false
    });
  }

  create(obj: Object): Promise<any> {
    return new Promise(() => { });
  }

}
