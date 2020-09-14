import express from 'express';
import { environment } from './util/environment';
import { DatabaseConfigService } from './util/db-connection-services/database-config-service';

const app = express();

new DatabaseConfigService().connect()
  .then(() => console.log('Successfully connected to DB'))
  .catch((e) => {
    console.error('Error connecting to DB', e);
    process.exit();
  });

app.set('port', environment.PORT);

export default app;