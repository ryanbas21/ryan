import { coinbaseHttp } from './coinbase-http';

describe('coinbaseHttp', () => {
  it('should work', () => {
    expect(coinbaseHttp()).toEqual('coinbase-http');
  });
});
