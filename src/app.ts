import express from 'express';
import cors from 'cors';
import { environment } from './util/environment';
import { DatabaseConfigService } from './util/db-connection-services/database-config.service';
import logsRouter from './controllers/logs.controller';
import { ErrorLogger } from './util/error-logging-service/error-logger.service';

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

const errorLogger = new ErrorLogger(databaseConfigService.databaseService);

app.set('port', environment.PORT);
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.db = databaseConfigService.databaseService;
  req.logger = errorLogger;
  next();
});

app.get('/health', async (req, res) => {
  const dbConnected = await req.db.isConnected();
  return res.status(dbConnected ? 200 : 500).json({
    now: new Date().getTime(),
    dbConnected,
    version: process.env.npm_package_version,
  });
});

app.use('/logs', logsRouter);

export default app;
