import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const PORT = parseInt(process.env.PORT) || 3000;

const CONFIG_PATH = process.env.CONFIG_PATH;

const LOG_SERVER_ERRORS = process.env.LOG_SERVER_ERROR !== 'false';

export const environment = {
  PORT,
  CONFIG_PATH,
  LOG_SERVER_ERRORS
};
