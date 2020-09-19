import mongoose from 'mongoose';
import { mocked } from 'ts-jest/utils';
import { LogStatementHelper, logStatementSchema } from './log-statement.model';
jest.mock('mongoose');
const mongooseMock = mocked(mongoose);

describe('createLogStatementDocument', () => {
  beforeEach(() => mongooseMock.model.mockReturnValue(<any>'NEW MODEL'));

  it('creates and returns a mongoose model with the correct collection name and schema', () => {
    const returnValue = LogStatementHelper.createLogStatementDocument('TEST_DOCUMENT');
    expect(returnValue).toBe('NEW MODEL');
    expect(mongooseMock.model).toHaveBeenCalledWith('TEST_DOCUMENT', logStatementSchema);
  });
});
