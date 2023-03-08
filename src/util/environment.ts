import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const PORT = parseInt(process.env.PORT ?? '') || 3000;

const CONFIG_PATH = process.env.CONFIG_PATH;

const CONFIG_JSON = process.env.CONFIG_JSON;

const LOG_SERVER_ERRORS = process.env.LOG_SERVER_ERROR !== 'false';

export const environment = {
  PORT,
  CONFIG_PATH,
  CONFIG_JSON,
  LOG_SERVER_ERRORS
};
