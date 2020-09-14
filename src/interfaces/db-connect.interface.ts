export interface DatabaseConnectionService {
  constructor: Function;
  connect: (connectionString: string) => Promise<any>;
}
