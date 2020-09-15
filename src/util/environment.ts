import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const PORT = parseInt(process.env.PORT) || 3000;

const CONFIG_PATH = process.env.CONFIG_PATH;

export const environment = {
  PORT,
  CONFIG_PATH
};
