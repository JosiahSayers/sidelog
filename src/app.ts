import express from 'express';
import { environment } from './util/environment';
import { DatabaseConfigService } from './util/db-connection-services/database-config.service';
import NodeCache from 'node-cache';
import { CACHE_KEYS } from './util/cache-keys';

const app = express();

const cache = new NodeCache({
  useClones: false,
  forceString: false
});

const databaseService = new DatabaseConfigService();
cache.set(CACHE_KEYS.dbConfig, databaseService);
databaseService.connect()
  .then(() => console.log('Successfully connected to DB'))
  .catch((e) => {
    console.error('Error connecting to DB', e);
    process.exit();
  });

app.set('port', environment.PORT);

app.use((req, res, next) => {
  req.cache = cache;
  next();
});

export default app;