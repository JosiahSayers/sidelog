import { DatabaseConfig } from './database-config.interface';
import { ApplicationConfig } from './application-config.interface';

export interface SidelogConfig {
  database: DatabaseConfig;
  applications: ApplicationConfig[];
}
