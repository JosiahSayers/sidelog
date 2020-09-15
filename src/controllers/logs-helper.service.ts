import { Request } from 'express'
import { LogStatementInterface, ValidLogLevels } from '../models/log-statement.model';
import { buildError } from '../util/error-builder';

const createLog = async (req: Request) => {
  try {
    const clientId = <string>req.headers.clientid;
    const logObject = req.body;
    validateLogRequest(req, clientId, logObject)
    return req.db.create(logObject, clientId);
  } catch (e) {
    const messageObject = JSON.parse(e.message);
    console.error('Error Creating Log', e)

    if (!messageObject?.responseCode) {
      throw new Error(buildError({
        message: 'Unknown error occured',
        developerMessage: 'Please check the app logs and report anything that looks fishy on GitHub, thanks!',
        responseCode: 500
      }));
    }

    throw e;
  }
};

const validateLogRequest = (req: Request, clientId: string, logMessage: LogStatementInterface): logMessage is LogStatementInterface => {
  if (!clientId) {
    throw new Error(buildError({
      message: 'Missing Client ID',
      developerMessage: 'Send a valid Client ID in the "clientId" header',
      responseCode: 400
    }));
  }

  if (!req.db.validateClientId(clientId)) {
    throw new Error(buildError({
      message: 'Invalid Client ID',
      developerMessage: `The passed in Client ID has not been setup. ID passed: ${clientId}`,
      responseCode: 400
    }));
  }

  if (!logMessage) {
    throw new Error(buildError({
      message: 'Missing log object',
      developerMessage: 'Send a valid body with the request',
      responseCode: 400
    }));
  }

  if (!logMessage.message) {
    throw new Error(buildError({
      message: 'Missing log message',
      developerMessage: 'Send a valid message field on the body',
      responseCode: 400
    }));
  }

  if (!logMessage.level) {
    throw new Error(buildError({
      message: 'Missing log level',
      developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
      responseCode: 400
    }));
  }

  if (!ValidLogLevels.includes(logMessage.level)) {
    throw new Error(buildError({
      message: 'Invalid log level',
      developerMessage: `Send a valid log level with the request. Valid Log Levels: ${JSON.stringify(ValidLogLevels)}`,
      responseCode: 400
    }));
  }

  return true;
};

export const LogsHelperService = {
  createLog
};
