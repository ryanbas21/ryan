import { readEnv } from './read-env';

describe('readEnv', () => {
  it('should work', () => {
    expect(readEnv()).toEqual('read-env');
  });
});
