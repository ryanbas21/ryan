import * as crypto from 'crypto';
import * as D from 'io-ts/Decoder';
import * as qs from 'querystring';
import { fold } from 'fp-ts/Either';
import { env, CoinbaseEnv } from '@ryan/env';

const secret = fold<unknown, CoinbaseEnv, string>(
        () => "Error Decoding",
        ({ COINBASE_SECRET }: CoinbaseEnv) => COINBASE_SECRET
    )(env.decode(process.env));

function signRequest(payload: qs.ParsedUrlQueryInput): string {
  const querystring = qs.stringify(payload);
  return crypto
          .createHmac('SHA256', secret)
          .update(querystring)
          .digest('hex')
}

export { signRequest, secret };