export interface ApplicationConfig {
  name: string;
  clientId: string;
  approvedOrigins?: string[];
  autoLogHeaders?: AutoLogHeaderEnum[];
}

export interface Application extends ApplicationConfig {
  dbAccessor: any
}

export enum AutoLogHeaderEnum {
  CLIENT_ID = 'clientid',
  CONTENT_LENGTH = 'content-length',
  CONTENT_TYPE = 'content-type',
  HOST = 'host',
  ORIGIN = 'origin',
  REFERER = 'referer',
  USER_AGENT = 'user-agent',
  IP_ADDRESS = 'ip'
}
