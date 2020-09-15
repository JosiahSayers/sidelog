import mongoose from 'mongoose';

export type LogStatementDocument = mongoose.Document & LogStatementInterface;

export type LogLevels = 'debug' | 'info' | 'warn' | 'error' | 'fatal' | 'trace';

export interface LogStatementInterface {
  message: string;
  json: object;
  level: LogLevels;
}

const logStatementSchema = new mongoose.Schema({
  message: { type: String, text: true },
  json: Object,
  level: { type: String, text: true },
}, { timestamps: true });

export const CreateLogStatementDocument = (appName: string) => mongoose.model<LogStatementDocument>(appName, logStatementSchema);