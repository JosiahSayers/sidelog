import { Application, ApplicationConfig } from '../../interfaces/application-config.interface';

export class BaseDatabaseService {
  applications = new Map<string, Application>();

  onboardApplication(app: ApplicationConfig, dbAccessor: any): void {
    this.applications.set(app.clientId, {
      name: app.name,
      clientId: app.clientId,
      approvedOrigins: app.approvedOrigins || [],
      dbAccessor
    });
  }

  isValidClientId(clientIdToTest: string): boolean {
    return !!this.applications.get(clientIdToTest);
  }

  isValidOrigin(originToTest: string, clientId: string): boolean {
    const app = this.applications.get(clientId);
    return app?.approvedOrigins.length === 0 || app?.approvedOrigins.includes(originToTest);
  }
}
