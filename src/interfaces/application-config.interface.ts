export interface ApplicationConfig {
  name: string;
  clientId: string;
  approvedOrigins?: string[];
}

export interface Application extends ApplicationConfig {
  dbAccessor: any
}
