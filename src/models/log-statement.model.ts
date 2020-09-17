import mongoose from 'mongoose';

export type LogStatementDocument = mongoose.Document & LogStatementInterface;

export type LogLevels = 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace';
export const ValidLogLevels: LogLevels[] = [
  'debug',
  'info',
  'warn',
  'error',
  'fatal',
  'trace'
];

export interface LogStatementInterface {
  message: string;
  json: Record<string, unknown>;
  level: LogLevels;
}

const logStatementSchema = new mongoose.Schema({
  message: { type: String, text: true },
  json: Object,
  level: { type: String, text: true },
}, { timestamps: true });

const createLogStatementDocument = (appName: string): mongoose.Model<LogStatementDocument> =>
  mongoose.model<LogStatementDocument>(appName, logStatementSchema);

export const LogStatementHelper = {
  createLogStatementDocument
};
