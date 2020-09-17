import { buildError, SidelogError } from './error-builder';

describe('buildError', () => {
  it('returns a SidelogError', () => {
    expect(buildError(<any>{}) instanceof SidelogError).toBeTruthy();
  });

  it('uses the passed in object to generate the error message', () => {
    const returnValue = buildError(<any>{ test: 'TEST' });
    expect(returnValue.message).toBe(JSON.stringify({ test: 'TEST' }));
  });
});
