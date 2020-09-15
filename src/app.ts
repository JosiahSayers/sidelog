import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import { environment } from './util/environment';
import { DatabaseConfigService } from './util/db-connection-services/database-config.service';
import logsRouter from './controllers/logs.controller';

const app = express();

const databaseConfigService = new DatabaseConfigService();
try {
  databaseConfigService.getConfig();
} catch (e) {
  console.error('Error parsing config', e);
  process.exit(9);
}
databaseConfigService.connect()
  .then(() => console.log('Successfully connected to DB'))
  .catch((e) => {
    console.error('Error connecting to DB', e);
    process.exit(9);
  });

app.set('port', environment.PORT);
app.use(cors());
app.use(bodyParser.json());

app.use((req, res, next) => {
  req.db = databaseConfigService.databaseService;
  next();
});

app.use('/logs', logsRouter);

export default app;
