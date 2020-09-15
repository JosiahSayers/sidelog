export interface DatabaseService {
  constructor: Function;
  connect: (connectionString: string) => Promise<any>;
  create: (obj: Object) => Promise<any>;
}
