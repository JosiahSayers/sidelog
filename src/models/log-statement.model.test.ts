import * as mongoose from 'mongoose';
import { LogStatementHelper, logStatementSchema } from './log-statement.model';
jest.mock('mongoose');

describe('createLogStatementDocument', () => {
  const spy = jest.spyOn(mongoose, 'model').mockReturnValue('NEW MODEL');

  it('creates and returns a mongoose model with the correct collection name and schema', () => {
    const returnValue = LogStatementHelper.createLogStatementDocument('TEST_DOCUMENT');
    expect(returnValue).toBe('NEW MODEL');
    expect(spy).toHaveBeenCalledWith('TEST_DOCUMENT', logStatementSchema);
  });
});
