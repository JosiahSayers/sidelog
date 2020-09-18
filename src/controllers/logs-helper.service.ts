import { Request } from 'express';
import { LogStatementInterface, ValidLogLevels } from '../models/log-statement.model';
import { buildError, SidelogError } from '../util/error-builder';

const createLog = async (req: Request): Promise<any> => {
  try {
    const clientId = <string>req.headers.clientid;
    const logObject = req.body;
    const origin = req.headers.origin;
    validateLogRequest(req, clientId, origin, logObject);
    await req.db.create(logObject, clientId);
    return;
  } catch (e) {
    if (!(e instanceof SidelogError)) {
      req.logger.log(e.message, { callStack: e.stack });
      throw buildError({
        message: 'Unknown error occured',
        developerMessage: 'Please check the app logs and report anything that looks fishy on GitHub, thanks!',
        responseCode: 500
      });
    }

    throw e;
  }
};

const validateLogRequest = (req: Request, clientId: string, origin: string, logMessage: LogStatementInterface): logMessage is LogStatementInterface => {
  if (!clientId) {
    throw buildError({
      message: 'Missing Client ID',
      developerMessage: 'Send a valid Client ID in the "clientId" header',
      responseCode: 400
    });
  }

  if (!req.db.isValidClientId(clientId)) {
    throw buildError({
      message: 'Invalid Client ID',
      developerMessage: `The passed in Client ID has not been setup. ID passed: ${clientId}`,
      responseCode: 400
    });
  }

  if (!req.db.isValidOrigin(origin, clientId)) {
    throw buildError({
      message: 'Unapproved origin',
      developerMessage: `The origin ${origin} has not been approved for use with client ID ${clientId}`,
      responseCode: 400
    });
  }

  if (!logMessage) {
    throw buildError({
      message: 'Missing log object',
      developerMessage: 'Send a valid body with the request',
      responseCode: 400
    });
  }

  if (!logMessage.message) {
    throw buildError({
      message: 'Missing log message',
      developerMessage: 'Send a valid message field on the body',
      responseCode: 400
    });
  }

  if (!logMessage.level) {
    throw buildError({
      message: 'Missing log level',
      developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
      responseCode: 400
    });
  }

  if (!ValidLogLevels.includes(logMessage.level)) {
    throw buildError({
      message: 'Invalid log level',
      developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
      responseCode: 400
    });
  }

  return true;
};

export const LogsHelperService = {
  createLog
};
