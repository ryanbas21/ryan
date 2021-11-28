import { signRequest } from './sign-request';

describe('signRequest', () => {
  it('should work', () => {
    expect(signRequest()).toEqual('sign-request');
  });
});
