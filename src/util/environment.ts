import dotenv from 'dotenv';

dotenv.config({ path: process.env.ENV_FILE || '.env' });

const PORT = parseInt(process.env.PORT) || 3000;

export const environment = {
  PORT
};
